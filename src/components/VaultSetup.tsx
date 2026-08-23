import { useState } from "react";
import { createVault } from "../services/vaultApi";

interface Props {
  onVaultCreated: () => void;
}

export default function VaultSetup({ onVaultCreated }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!password || password !== confirmPassword) {
      setError("Passphrases do not match or are empty.");
      return;
    }
    try {
      await createVault(password);
      onVaultCreated();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="newsprint-box" style={{ maxWidth: "480px", margin: "40px auto" }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid #111111", paddingBottom: "16px", marginBottom: "24px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#CC0000", display: "block", marginBottom: "4px" }}>
          Initial Issuance
        </span>
        <h2 className="font-headline" style={{ fontSize: "1.75rem", fontWeight: "bold", margin: 0 }}>
          Initialize New Vault
        </h2>
      </div>

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #CC0000", color: "#CC0000", padding: "8px", fontSize: "12px", marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>
          {error}
        </div>
      )}

      <div className="font-editorial">
        <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
          Master Passphrase *
        </label>
        <input
          type="password"
          placeholder="Secure master key..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", marginTop: "12px" }}>
          Confirm Passphrase *
        </label>
        <input
          type="password"
          placeholder="Re-enter master key..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleCreate}
          style={{ width: "100%", marginTop: "16px", padding: "12px" }}
        >
          Publish New Vault Edition →
        </button>
      </div>
    </div>
  );
}