use crate::vault::vault_builder::create_empty_vault_file;
use crate::vault::storage::{
    save_vault,
    load_vault,
};
use crate::vault::storage::read_vault;
use crate::vault::vault_loader::parse_vault_file;
use crate::vault::vault_decryptor::decrypt_vault;

#[tauri::command]
pub fn create_vault(
    password: String,
) -> Result<String, String> {

    let vault_json =
        create_empty_vault_file(
            &password
        )?;

    save_vault(&vault_json)?;

    Ok(
        "Vault created successfully"
            .to_string()
    )
}

#[tauri::command]
pub fn open_vault() -> Result<String, String> {
    load_vault()
}

#[tauri::command]
pub fn unlock_vault(
    password: String,
) -> Result<String, String> {

    let content =
        read_vault()?;

    let vault_file =
        parse_vault_file(
            &content
        )?;

    let vault =
        decrypt_vault(
            vault_file,
            &password
        )?;

    serde_json::to_string_pretty(
        &vault
    )
    .map_err(|e| e.to_string())
}