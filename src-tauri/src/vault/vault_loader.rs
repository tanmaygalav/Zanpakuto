use crate::models::vault_file::VaultFile;

pub fn parse_vault_file(
    content: &str,
) -> Result<VaultFile, String> {

    serde_json::from_str(content)
        .map_err(|e| e.to_string())
}   

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_json() {

        let json = r#"
        {
            "version":1,
            "salt":"abc",
            "encrypted_vault_key":"a",
            "vault_key_nonce":"b",
            "vault_nonce":"c",
            "encrypted_data":"d"
        }
        "#;

        let vault =
            parse_vault_file(json).unwrap();

        assert_eq!(vault.version, 1);
    }
}