# ⚔️ Zanpakuto
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/79ce269f-3c6a-4ff3-b6ab-7813644d6cc4" />

A secure, local-first password manager built with **Rust**, **Tauri**, and **React**.

Zanpakuto encrypts your passwords using a master password and stores everything locally on your machine. No cloud services, no telemetry, no third-party servers — your vault stays under your control.

---

## ✨ Features

### Current Features

- 🔐 Master Password Protected Vault
- 🔓 Unlock Encrypted Vault
- ➕ Create Password Entries
- ✏️ Edit Existing Entries
- 🗑️ Delete Entries
- 👁️ Show / Hide Passwords
- 📋 Copy Password To Clipboard
- 🔍 Search Stored Passwords
- 💾 Local Vault Storage
- 🔒 AES-GCM Encryption
- 🧂 Argon2 Password-Based Key Derivation
- ⚡ Rust Backend For Security-Critical Operations
- 🖥️ Cross-Platform Desktop Application

---

## 🚧 Planned Features

### Security

- Auto-Lock Vault
- Vault Lock Button
- Clipboard Auto-Clear
- Password Breach Detection
- Password Expiry Warnings

### Password Management

- Password Generator
- Password Strength Meter
- Categories & Tags
- Favorites
- Recently Used Passwords

### User Experience

- Modern Dark UI
- Keyboard Shortcuts
- Quick Search
- Sorting & Filtering
- Import / Export Vault

### Advanced

- Multi-Vault Support
- Backup & Recovery
- Browser Extension
- Biometric Authentication
- TOTP / 2FA Storage

---

# 🏗️ Architecture

```text
┌─────────────────────┐
│ React Frontend      │
│ TypeScript          │
└──────────┬──────────┘
           │
           │ Tauri Commands
           │
┌──────────▼──────────┐
│ Rust Backend        │
│ Vault Logic         │
│ Encryption          │
│ Storage             │
└──────────┬──────────┘
           │
           │
┌──────────▼──────────┐
│ Encrypted Vault     │
│ JSON File           │
└─────────────────────┘
```

All encryption and decryption operations occur inside the Rust backend.

The React frontend never performs cryptographic operations directly.

---

# 🔐 Security Design

## Key Derivation

Master passwords are never used directly as encryption keys.

Instead:

```text
Master Password
        │
        ▼
Argon2
        │
        ▼
256-bit Encryption Key
```

Argon2 is a memory-hard password hashing algorithm designed to resist brute-force attacks.

---

## Encryption

Vault contents are encrypted using:

```text
AES-256-GCM
```

Benefits:

- Authenticated Encryption
- Tamper Detection
- Strong Industry Standard
- Fast Hardware Acceleration

---

## Vault Structure

Before Encryption:

```json
{
  "entries": [
    {
      "id": "...",
      "title": "GitHub",
      "username": "user",
      "password": "secret",
      "url": "https://github.com",
      "notes": "Personal account"
    }
  ]
}
```

Stored Vault:

```json
{
  "version": 1,
  "salt": "...",
  "nonce": "...",
  "ciphertext": "..."
}
```

Passwords are never stored in plaintext on disk.

---

# 📁 Project Structure

```text
src/
│
├── components/
│   ├── PasswordCard.tsx
│   ├── PasswordList.tsx
│   └── VaultUnlock.tsx
│
├── services/
│   └── vaultApi.ts
│
├── types/
│   └── PasswordEntry.ts
│
├── App.tsx
│
└── App.css

src-tauri/
│
├── src/
│   │
│   ├── commands/
│   │   └── vault_commands.rs
│   │
│   ├── crypto/
│   │   ├── encryption.rs
│   │   └── key_derivation.rs
│   │
│   ├── vault/
│   │   ├── storage.rs
│   │   ├── vault_builder.rs
│   │   ├── vault_loader.rs
│   │   ├── vault_decryptor.rs
│   │   ├── vault_editor.rs
│   │   └── vault_manager.rs
│   │
│   ├── models/
│   │   ├── password_entry.rs
│   │   ├── vault.rs
│   │   └── vault_file.rs
│   │
│   ├── lib.rs
│   └── main.rs
│
├── Cargo.toml
└── tauri.conf.json
```

---

# 🚀 Getting Started

## Prerequisites

### Linux

Install Rust:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Install Node.js:

```bash
sudo apt install nodejs npm
```

Install Tauri dependencies:

```bash
sudo apt install \
libwebkit2gtk-4.1-dev \
build-essential \
curl \
wget \
file \
libxdo-dev \
libssl-dev \
libayatana-appindicator3-dev \
librsvg2-dev
```

---

## Clone Repository

```bash
git clone https://github.com/tanmaygalav/zanpakuto.git

cd zanpakuto
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run tauri dev
```

---

## Build Production Application

```bash
npm run tauri build
```

Build artifacts will be generated inside:

```text
src-tauri/target/release/
```

---

# 📖 Usage

## Create Vault

1. Launch application
2. Enter master password
3. Create vault

---

## Unlock Vault

1. Enter master password
2. Click:

```text
Unlock Vault
```

---

## Add Password

Fill:

```text
Title
Username
Password
URL
Notes
```

Then:

```text
Save Entry
```

---

## Edit Password

Click:

```text
Edit
```

Modify fields and click:

```text
Update Entry
```

---

## Delete Password

Click:

```text
Delete
```

The entry is removed from the encrypted vault.

---

# 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Rust
- Tauri

### Cryptography

- AES-GCM
- Argon2
- Rand

### Serialization

- Serde
- Serde JSON

### Utilities

- UUID
- Chrono

---

# 🎯 Goals

Zanpakuto is being built to explore:

- Secure Software Engineering
- Applied Cryptography
- Rust Systems Programming
- Desktop Application Development
- Privacy-First Design

The long-term goal is to evolve Zanpakuto into a modern, secure, cross-platform password manager comparable to Bitwarden and Proton Pass while remaining fully local-first.

---

# ⚠️ Disclaimer

Zanpakuto is currently under active development.

Do not rely on it as your sole password manager for critical accounts until it has undergone extensive testing, security review, and backup/recovery implementation.

---

# 📜 License

MIT License

Copyright (c) 2026

---

# 👨‍💻 Author

**Tanmay Galav**

Built with Rust ⚙️ + React ⚛️ + Tauri 🦀
