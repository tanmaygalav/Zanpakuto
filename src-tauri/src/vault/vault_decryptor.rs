use base64::{
    engine::general_purpose,
    Engine as _,
};

use crate::models::{
    vault::VaultData,
    vault_file::VaultFile,
};

use crate::crypto::key_derivation::derive_key;
use crate::vault::encryption::decrypt;

pub fn decrypt_vault(
    vault_file: VaultFile,
    password: &str,
) -> Result<VaultData, String> {

    let salt = general_purpose::STANDARD
        .decode(vault_file.salt)
        .map_err(|e| e.to_string())?;

    let key =
        derive_key(password, &salt)?;

    let nonce_vec = general_purpose::STANDARD
        .decode(vault_file.vault_nonce)
        .map_err(|e| e.to_string())?;

    let nonce: [u8; 12] = nonce_vec
        .try_into()
        .map_err(|_| "Invalid nonce")?;

    let encrypted = general_purpose::STANDARD
        .decode(vault_file.encrypted_data)
        .map_err(|e| e.to_string())?;

    let decrypted =
        decrypt(
            &key,
            &encrypted,
            &nonce,
        )?;

    let vault: VaultData =
        serde_json::from_slice(&decrypted)
            .map_err(|e| e.to_string())?;

    Ok(vault)
}