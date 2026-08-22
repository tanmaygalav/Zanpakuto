use crate::models::vault::VaultData;

pub fn create_empty_vault() -> VaultData {
    VaultData {
        version: 1,
        entries: vec![],
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_vault_has_no_entries() {
        let vault = create_empty_vault();

        assert_eq!(vault.entries.len(), 0);
        assert_eq!(vault.version, 1);
    }
}