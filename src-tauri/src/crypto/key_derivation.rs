use argon2::{Algorithm, Argon2, Params, Version};

pub fn generate_salt() -> SaltString {
    SaltString::generate(&mut rand::thread_rng())
}

pub fn derive_key(password: &str, salt: &SaltString) -> Result<Vec<u8>, String> {
        
    let params = Params::new(
        65536,
        3,
        1,
        Some(32)
    ).unwrap();

    let argon2 = Argon2::new(
        Algorithm::Argon2id,
        Version::V0x13,
        params,
    );

    let hash = argon2
        .hash_password(password.as_bytes(), salt)
        .map_err(|e| e.to_string())?;

    Ok(hash.hash.unwrap().as_bytes().to_vec())
}