// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod commands;
mod crypto;
mod models;
mod vault;

use commands::vault_commands::{
    create_vault,
    open_vault,
    unlock_vault,
    save_entry,
    update_entry_command,
    delete_entry_command,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(
            tauri::generate_handler![
            create_vault,
            open_vault,
            unlock_vault,
            save_entry,
            update_entry_command,
            delete_entry_command,
        ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
