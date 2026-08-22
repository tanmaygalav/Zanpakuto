use serde::{Deserialize, Serialize};

use super::password_entry::PasswordEntry;

#[derive(Debug, Serialize, Deserialize)]
pub struct Vault {
    pub version: u32,
    pub entries: Vec<PasswordEntry>,
}