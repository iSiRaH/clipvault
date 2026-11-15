use async_trait::async_trait;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    collections::{HashSet, VecDeque},
    sync::Arc,
    time::Duration,
};
use thiserror::Error;
use tokio::sync::{mpsc, watch};
use uuid::Uuid;

/// Represents the supported clipboard data formats.
///
/// Additional formats can be added without changing the item model.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(tag = "type", content = "data")]
pub enum ClipboardContent {
    Text(String),
    Html(String),
    Image {
        mime_type: String,
        data: Vec<u8>,
        width: Option<u32>,
        height: Option<u32>,
    },
    Files(Vec<String>),
}

impl ClipboardContent {
    /// Returns a stable SHA-256 hash of the content and its format.
    pub fn content_hash(&self) -> String {
        let mut hasher = Sha256::new();

        match self {
            Self::Text(text) => {
                hasher.update(b"text:");
                hasher.update(text.as_bytes());
            }
            Self::Html(html) => {
                hasher.update(b"html:");
                hasher.update(html.as_bytes());
            }
            Self::Image {
                mime_type,
                data,
                width,
                height,
            } => {
                hasher.update(b"image:");
                hasher.update(mime_type.as_bytes());
                hasher.update(data);
                hasher.update(width.unwrap_or_default().to_le_bytes());
                hasher.update(height.unwrap_or_default().to_le_bytes());
            }
            Self::Files(paths) => {
                hasher.update(b"files:");
                for path in paths {
                    hasher.update(path.as_bytes());
                    hasher.update([0]);
                }
            }
        }

        hex::encode(hasher.finalize())
    }

    pub fn content_type(&self) -> &'static str {
        match self {
            Self::Text(_) => "text",
            Self::Html(_) => "html",
            Self::Image { .. } => "image",
            Self::Files(_) => "files",
        }
    }

    pub fn preview(&self) -> String {
        match self {
            Self::Text(text) => text.clone(),
            Self::Html(html) => html.clone(),
            Self::Image { mime_type, .. } => format!("[Image: {mime_type}]"),
            Self::Files(paths) => paths.join("\n"),
        }
    }
}

/// A single saved clipboard entry.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClipboardItem {
    pub id: Uuid,
    pub content: ClipboardContent,
    pub content_hash: String,
    pub content_type: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub is_pinned: bool,
    pub source_app: Option<String>,
}

impl ClipboardItem {
    pub fn new(content: ClipboardContent) -> Self {
        let now = Utc::now();
        let content_hash = content.content_hash();
        let content_type = content.content_type().to_string();

        Self {
            id: Uuid::new_v4(),
            content,
            content_hash,
            content_type,
            created_at: now,
            updated_at: now,
            is_pinned: false,
            source_app: None,
        }
    }

    pub fn with_source_app(mut self, source_app: impl Into<String>) -> Self {
        self.source_app = Some(source_app.into());
        self
    }

    pub fn set_pinned(&mut self, pinned: bool) {
        self.is_pinned = pinned;
        self.updated_at = Utc::now();
    }
}

/// Prevents recently captured content from being stored repeatedly.
pub struct DuplicateDetector {
    seen: HashSet<String>,
    insertion_order: VecDeque<String>,
    capacity: usize,
}

impl DuplicateDetector {
    pub fn new(capacity: usize) -> Self {
        Self {
            seen: HashSet::new(),
            insertion_order: VecDeque::new(),
            capacity: capacity.max(1),
        }
    }

    /// Returns true if this content has already been seen.
    /// New hashes are remembered automatically.
    pub fn is_duplicate(&mut self, content: &ClipboardContent) -> bool {
        let hash = content.content_hash();

        if self.seen.contains(&hash) {
            return true;
        }

        self.seen.insert(hash.clone());
        self.insertion_order.push_back(hash);

        while self.insertion_order.len() > self.capacity {
            if let Some(oldest) = self.insertion_order.pop_front() {
                self.seen.remove(&oldest);
            }
        }

        false
    }

    pub fn clear(&mut self) {
        self.seen.clear();
        self.insertion_order.clear();
    }
}

impl Default for DuplicateDetector {
    fn default() -> Self {
        Self::new(1_000)
    }
}

#[derive(Debug, Error)]
pub enum ClipboardError {
    #[error("Clipboard backend error: {0}")]
    Backend(String),

    #[error("Clipboard monitoring task failed: {0}")]
    Task(String),
}

/// Errors and captured items emitted by the monitoring engine.
#[derive(Debug, Clone)]
pub enum ClipboardEvent {
    ItemCaptured(ClipboardItem),
    BackendError(String),
}

/// Platform-independent clipboard access contract.
///
/// Linux, Windows and macOS implementations can implement this trait.
#[async_trait]
pub trait ClipboardProvider: Send + Sync + 'static {
    async fn read_content(&self) -> Result<Option<ClipboardContent>, ClipboardError>;
}

/// Polls a clipboard provider and sends newly captured items through a channel.
///
/// The receiver can be consumed by the storage layer or the Tauri application.
pub async fn monitor_clipboard<P>(
    provider: Arc<P>,
    sender: mpsc::Sender<ClipboardEvent>,
    mut shutdown: watch::Receiver<bool>,
    poll_interval: Duration,
) where
    P: ClipboardProvider,
{
    let mut detector = DuplicateDetector::default();
    let mut interval = tokio::time::interval(poll_interval.max(Duration::from_millis(100)));

    loop {
        tokio::select! {
            _ = interval.tick() => {
                match provider.read_content().await {
                    Ok(Some(content)) => {
                        if !detector.is_duplicate(&content) {
                            let item = ClipboardItem::new(content);

                            if sender.send(ClipboardEvent::ItemCaptured(item)).await.is_err() {
                                break;
                            }
                        }
                    }
                    Ok(None) => {}
                    Err(error) => {
                        if sender.send(
                            ClipboardEvent::BackendError(error.to_string())
                        ).await.is_err() {
                            break;
                        }
                    }
                }
            }

            result = shutdown.changed() => {
                if result.is_err() || *shutdown.borrow() {
                    break;
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_text_clipboard_item() {
        let item = ClipboardItem::new(
            ClipboardContent::Text("Hello ClipVault".to_string())
        );

        assert_eq!(item.content_type, "text");
        assert!(!item.is_pinned);
        assert_eq!(item.content.preview(), "Hello ClipVault");
    }

    #[test]
    fn detects_duplicate_text() {
        let mut detector = DuplicateDetector::default();

        let first = ClipboardContent::Text("ClipVault".to_string());
        let second = ClipboardContent::Text("ClipVault".to_string());

        assert!(!detector.is_duplicate(&first));
        assert!(detector.is_duplicate(&second));
    }

    #[test]
    fn different_content_has_different_hash() {
        let first = ClipboardContent::Text("First".to_string());
        let second = ClipboardContent::Text("Second".to_string());

        assert_ne!(first.content_hash(), second.content_hash());
    }

    #[test]
    fn different_content_types_have_different_hashes() {
        let text = ClipboardContent::Text("<b>Hello</b>".to_string());
        let html = ClipboardContent::Html("<b>Hello</b>".to_string());

        assert_ne!(text.content_hash(), html.content_hash());
    }

    #[test]
    fn duplicate_cache_respects_capacity() {
        let mut detector = DuplicateDetector::new(2);

        let first = ClipboardContent::Text("one".to_string());
        let second = ClipboardContent::Text("two".to_string());
        let third = ClipboardContent::Text("three".to_string());

        assert!(!detector.is_duplicate(&first));
        assert!(!detector.is_duplicate(&second));
        assert!(!detector.is_duplicate(&third));

        // The oldest hash has been evicted.
        assert!(!detector.is_duplicate(&first));
    }
}