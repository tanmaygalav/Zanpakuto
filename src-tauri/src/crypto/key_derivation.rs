use argon2::{
    Algorithm,
    Argon2,
    Params,
    Version,
};

use rand::RngCore;

pub fn generate_salt() -> [u8; 16] {
    let mut salt = [0u8; 16];
    rand::thread_rng().fill_bytes(&mut salt);
    salt
}

pub fn derive_key(
    password: &str,
    salt: &[u8],
) -> Result<[u8; 32], String> {

    let params = Params::new(
        65536,
        3,
        1,
        Some(32),
    )
    .map_err(|e| e.to_string())?;

    let argon2 = Argon2::new(
        Algorithm::Argon2id,
        Version::V0x13,
        params,
    );

    let mut key = [0u8; 32];

    argon2
        .hash_password_into(
            password.as_bytes(),
            salt,
            &mut key,
        )
        .map_err(|e| e.to_string())?;

    Ok(key)
}