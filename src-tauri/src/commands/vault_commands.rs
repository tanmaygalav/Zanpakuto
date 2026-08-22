use crate::vault::vault_builder::create_empty_vault_file;
use crate::vault::storage::{
    save_vault,
    load_vault,
};
use crate::vault::storage::read_vault;
use crate::vault::vault_loader::parse_vault_file;
use crate::vault::vault_decryptor::decrypt_vault;

use crate::models::password_entry::PasswordEntry;
use crate::vault::vault_builder::create_vault_file;

use crate::vault::vault_editor::{
    add_entry,
    update_entry,
    delete_entry,
};

use uuid::Uuid;
use chrono::Utc;



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


#[tauri::command]
pub fn save_entry(
    master_password: String,

    title: String,
    username: String,
    password_value: String,
    url: String,
    notes: String,
) -> Result<String, String> {

    let content =
        read_vault()?;

    let vault_file =
        parse_vault_file(
            &content
        )?;

    let mut vault =
        decrypt_vault(
            vault_file,
            &master_password
        )?;

    let now =
        Utc::now()
            .to_rfc3339();

    let entry = PasswordEntry {
        id: Uuid::new_v4().to_string(),

        title,

        username,

        password: password_value,

        url,

        notes,

        created_at: now.clone(),

        updated_at: now,
    };

    add_entry(
        &mut vault,
        entry,
    );

    let encrypted_json =
        create_vault_file(
            &master_password,
            &vault,
        )?;

    save_vault(
        &encrypted_json
    )?;

    Ok(
        "Entry saved".to_string()
    )
}

#[tauri::command]
pub fn update_entry_command(
    password: String,
    entry: PasswordEntry,
) -> Result<String, String> {

    let content =
        read_vault()?;

    let vault_file =
        parse_vault_file(
            &content
        )?;

    let mut vault =
        decrypt_vault(
            vault_file,
            &password
        )?;

    update_entry(
        &mut vault,
        entry,
    );

    let vault_json =
    create_vault_file(
        &password,
        &vault,
    )?;

    save_vault(
        &vault_json
    )?;

    Ok(
        "Entry updated"
            .to_string()
    )
}

#[tauri::command]
pub fn delete_entry_command(
    password: String,
    id: String,
) -> Result<String, String> {

    let content =
        read_vault()?;

    let vault_file =
        parse_vault_file(
            &content
        )?;

    let mut vault =
        decrypt_vault(
            vault_file,
            &password
        )?;

    delete_entry(
        &mut vault,
        &id,
    );

    let vault_json =
        create_vault_file(
            &password,
            &vault,
        )?;

    save_vault(
        &vault_json
    )?;

    Ok(
        "Entry deleted"
            .to_string()
    )
}