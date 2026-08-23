use std::sync::Mutex;
use crate::models::vault::VaultData;

pub struct VaultSession {
    pub encryption_key: Mutex<Option<[u8; 32]>>,
    pub vault_salt: Mutex<Option<Vec<u8>>>,
    pub decrypted_vault: Mutex<Option<VaultData>>,
}