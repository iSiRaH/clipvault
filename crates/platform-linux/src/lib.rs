use arboard::Clipboard;
use async_trait::async_trait;
use clipboard_core::{
    ClipboardContent,
    ClipboardError,
    ClipboardProvider,
};

/// Linux clipboard provider.
///
/// Clipboard access is performed on a blocking thread because
/// desktop clipboard operations are synchronous.
#[derive(Debug, Clone, Default)]
pub struct LinuxClipboardProvider;

impl LinuxClipboardProvider {
    pub fn new() -> Self {
        Self
    }
}

#[async_trait]
impl ClipboardProvider for LinuxClipboardProvider {
    async fn read_content(
        &self,
    ) -> Result<Option<ClipboardContent>, ClipboardError> {
        tokio::task::spawn_blocking(|| {
            let mut clipboard = Clipboard::new().map_err(|error| {
                ClipboardError::Backend(error.to_string())
            })?;

            // The initial implementation captures text only.
            // Non-text clipboard content is ignored for now.
            match clipboard.get_text() {
                Ok(text) if !text.is_empty() => {
                    Ok(Some(ClipboardContent::Text(text)))
                }
                Ok(_) => Ok(None),
                Err(_) => Ok(None),
            }
        })
        .await
        .map_err(|error| ClipboardError::Task(error.to_string()))?
    }
}

/// Detects the current Linux display session.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LinuxSession {
    Wayland,
    X11,
    Unknown,
}

pub fn detect_session() -> LinuxSession {
    if std::env::var_os("WAYLAND_DISPLAY").is_some() {
        LinuxSession::Wayland
    } else if std::env::var_os("DISPLAY").is_some() {
        LinuxSession::X11
    } else {
        LinuxSession::Unknown
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn provider_can_be_created() {
        let _provider = LinuxClipboardProvider::new();
    }

    #[test]
    fn session_detection_returns_a_valid_value() {
        let session = detect_session();

        assert!(matches!(
            session,
            LinuxSession::Wayland
                | LinuxSession::X11
                | LinuxSession::Unknown
        ));
    }
}