# Zanpakuto Security Architecture

## Key Derivation

Argon2id
Memory: 64 MB
Iterations: 3
Parallelism: 1

## Encryption

AES-256-GCM

## Salt

16 bytes random

## Nonce

12 bytes random

## Key Hierarchy

Master Password
    ↓
Master Key
    ↓
Vault Key
    ↓
Vault Data