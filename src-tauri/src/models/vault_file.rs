use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct VaultFile {
    pub version: u32,

    pub salt: String,

    pub nonce: String,

    pub encrypted_data: String,
}