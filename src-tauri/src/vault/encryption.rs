use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm,
    Nonce,
};

use rand::RngCore;

pub fn generate_nonce() -> [u8; 12] {
    let mut nonce = [0u8; 12];
    rand::thread_rng().fill_bytes(&mut nonce);
    nonce
}

pub fn encrypt(
    key: &[u8; 32],
    plaintext: &[u8],
) -> Result<(Vec<u8>, [u8; 12]), String> {

    let cipher = Aes256Gcm::new_from_slice(key)
        .map_err(|e| e.to_string())?;

    let nonce = generate_nonce();

    let ciphertext = cipher
        .encrypt(
            Nonce::from_slice(&nonce),
            plaintext,
        )
        .map_err(|e| e.to_string())?;

    Ok((ciphertext, nonce))
}

pub fn decrypt(
    key: &[u8; 32],
    ciphertext: &[u8],
    nonce: &[u8; 12],
) -> Result<Vec<u8>, String> {

    let cipher = Aes256Gcm::new_from_slice(key)
        .map_err(|e| e.to_string())?;

    let plaintext = cipher
        .decrypt(
            Nonce::from_slice(nonce),
            ciphertext,
        )
        .map_err(|e| e.to_string())?;

    Ok(plaintext)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encrypt_then_decrypt() {
        let key = [42u8; 32];

        let data = b"zanpakuto";

        let (ciphertext, nonce) =
            encrypt(&key, data).unwrap();

        let decrypted =
            decrypt(&key, &ciphertext, &nonce)
                .unwrap();

        assert_eq!(
            data.to_vec(),
            decrypted
        );
    }
}   