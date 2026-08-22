use crate::vault::vault_builder::create_empty_vault_file;
use crate::vault::storage::{
    save_vault,
    load_vault,
};

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