use crate::crypto::key_derivation::{
    derive_key,
    generate_salt,
};

use crate::models::vault::VaultData;
use crate::models::vault_file::VaultFile;

use crate::vault::encryption::encrypt;

use base64::{engine::general_purpose, Engine as _};

pub fn create_empty_vault_file(
    password: &str,
) -> Result<String, String> {

    let vault = VaultData {
        version: 1,
        entries: vec![],
    };

    let json = serde_json::to_string(&vault)
        .map_err(|e| e.to_string())?;

    let salt = generate_salt();

    let key = derive_key(password, &salt)?;

    let (encrypted_data, vault_nonce) =
        encrypt(
            &key,
            json.as_bytes(),
        )?;

    let file = VaultFile {
        version: 1,

        salt: general_purpose::STANDARD
            .encode(salt),

        // Temporary placeholders
        encrypted_vault_key: String::new(),

        vault_key_nonce: String::new(),

        vault_nonce: general_purpose::STANDARD
            .encode(vault_nonce),

        encrypted_data: general_purpose::STANDARD
            .encode(encrypted_data),
    };

    serde_json::to_string_pretty(&file)
        .map_err(|e| e.to_string())
}