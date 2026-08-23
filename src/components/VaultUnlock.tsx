interface Props {
  masterPassword: string;
  setMasterPassword: (value: string) => void;
  unlockVault: () => void;
}

export default function VaultUnlock({
  masterPassword,
  setMasterPassword,
  unlockVault,
}: Props) {
  return (
    <div className="newsprint-box">
      <div style={{ textAlign: "center", borderBottom: "1px solid #111111", paddingBottom: "16px", marginBottom: "24px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#737373", display: "block", marginBottom: "4px" }}>
          Restricted Dispatch
        </span>
        <h2 className="font-headline" style={{ fontSize: "1.75rem", fontWeight: "bold", margin: 0 }}>
          Authorize Vault Access
        </h2>
      </div>

      <div>
        <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
          Master Passphrase
        </label>
        <input
          type="password"
          placeholder="Enter master key..."
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && unlockVault()}
        />

        <button
          onClick={unlockVault}
          style={{ width: "100%", marginTop: "12px", padding: "12px" }}
        >
          Decrypt & Open Vault →
        </button>
      </div>
    </div>
  );
}