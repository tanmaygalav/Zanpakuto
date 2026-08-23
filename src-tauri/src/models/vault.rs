use serde::{Deserialize, Serialize};

use super::password_entry::PasswordEntry;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VaultData {
    pub version: u32,
    pub entries: Vec<PasswordEntry>,
}