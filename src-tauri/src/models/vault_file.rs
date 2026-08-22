use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct VaultFile {
    pub version: u32,

    pub salt: String,

    pub encrypted_vault_key: String,
    pub vault_key_nonce: String,

    pub vault_nonce: String,
    pub encrypted_data: String,
}