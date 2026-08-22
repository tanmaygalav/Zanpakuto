use crate::models::{
    vault::VaultData,
    password_entry::PasswordEntry,
};

pub fn add_entry(
    vault: &mut VaultData,
    entry: PasswordEntry,
) {
    vault.entries.push(entry);
}

pub fn update_entry(
    vault: &mut VaultData,
    updated: PasswordEntry,
) {
    if let Some(entry) = vault
        .entries
        .iter_mut()
        .find(|e| e.id == updated.id)
    {
        *entry = updated;
    }
}

pub fn delete_entry(
    vault: &mut VaultData,
    id: &str,
) {
    vault.entries.retain(|e| e.id != id);
}



#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{
        vault::VaultData,
        password_entry::PasswordEntry,
    };

    fn sample_entry() -> PasswordEntry {
        PasswordEntry {
            id: "1".into(),
            title: "GitHub".into(),
            username: "tanmay".into(),
            password: "123".into(),
            url: "".into(),
            notes: "".into(),
            created_at: "".into(),
            updated_at: "".into(),
        }
    }

    #[test]
    fn add_password_entry() {
        let mut vault = VaultData {
            version: 1,
            entries: vec![],
        };

        add_entry(
            &mut vault,
            sample_entry(),
        );

        assert_eq!(
            vault.entries.len(),
            1
        );
    }

    #[test]
    fn delete_password_entry() {
        let mut vault = VaultData {
            version: 1,
            entries: vec![sample_entry()],
        };

        delete_entry(
            &mut vault,
            "1",
        );

        assert_eq!(
            vault.entries.len(),
            0
        );
    }

    #[test]
    fn update_password_entry() {
        let mut vault = VaultData {
            version: 1,
            entries: vec![sample_entry()],
        };

        let mut updated =
            sample_entry();

        updated.title =
            "Updated".into();

        update_entry(
            &mut vault,
            updated,
        );

        assert_eq!(
            vault.entries[0].title,
            "Updated"
        );
    }
}