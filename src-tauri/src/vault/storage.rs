use std::fs;
use std::path::PathBuf;

pub fn get_default_vault_path() -> Result<PathBuf, String> {
    let home = dirs::home_dir()
        .ok_or("Could not find home directory")?;

    Ok(home.join("Zanpakuto.zpk"))
}

pub fn save_vault(
    content: &str,
) -> Result<(), String> {

    let path = get_default_vault_path()?;

    fs::write(path, content)
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn load_vault() -> Result<String, String> {
    let path = get_default_vault_path()?;

    let content =
        std::fs::read_to_string(path)
            .map_err(|e| e.to_string())?;

    Ok(content)
}

pub fn read_vault() -> Result<String, String> {
    let path =
        get_default_vault_path()?;

    std::fs::read_to_string(path)
        .map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn path_generation() {
        let path =
            get_default_vault_path().unwrap();

        assert!(
            path.to_string_lossy()
                .contains("Zanpakuto.zpk")
        );
    }
}