use std::sync::Arc;
use std::time::Duration;
use tauri::{Emitter, Listener};
use tokio::sync::watch;

#[cfg(target_os = "linux")]
use platform_linux::LinuxClipboardProvider;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            #[cfg(target_os = "linux")]
            {
                let handle = app.handle().clone();
                let (shutdown_tx, shutdown_rx) = watch::channel(false);
                let (event_tx, mut event_rx) = tokio::sync::mpsc::channel(100);

                // Spawn event receiver to emit to frontend
                tauri::async_runtime::spawn(async move {
                    while let Some(event) = event_rx.recv().await {
                        match event {
                            clipboard_core::ClipboardEvent::ItemCaptured(item) => {
                                let _ = handle.emit("clipboard://item", item);
                            }
                            clipboard_core::ClipboardEvent::BackendError(err) => {
                                let _ = handle.emit("clipboard://error", err);
                            }
                        }
                    }
                });

                // Spawn monitoring engine
                tauri::async_runtime::spawn(async move {
                    let provider = Arc::new(LinuxClipboardProvider::new());
                    clipboard_core::monitor_clipboard(
                        provider,
                        event_tx,
                        shutdown_rx,
                        Duration::from_millis(500),
                    )
                    .await;
                });

                // Ensure clean shutdown when the application exits
                let app_handle = app.handle().clone();
                let shutdown_tx = Arc::new(tokio::sync::Mutex::new(Some(shutdown_tx)));
                app_handle.once("tauri://destroyed", move |_| {
                    let shutdown_tx = shutdown_tx.clone();
                    tauri::async_runtime::spawn(async move {
                        if let Some(tx) = shutdown_tx.lock().await.take() {
                            let _ = tx.send(true);
                        }
                    });
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
