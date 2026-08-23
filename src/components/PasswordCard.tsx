import { useState } from "react";
import { PasswordEntry } from "../types/PasswordEntry";

interface Props {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export default function PasswordCard({
  entry,
  onEdit,
  onDelete,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyPassword() {
    await navigator.clipboard.writeText(entry.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Evaluate audit strength for stored card
  function getCardStrength(pass: string) {
    let score = 0;
    if (pass.length >= 12) score++;
    if (pass.length >= 16) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score >= 4) return { label: "SECURE", bg: "#111111", color: "#F9F9F7" };
    if (score === 3) return { label: "MODERATE", bg: "#fef3c7", color: "#b45309" };
    return { label: "WEAK", bg: "#fee2e2", color: "#CC0000" };
  }

  const strength = getCardStrength(entry.password);

  return (
    <div className="newsprint-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E5E5E0", paddingBottom: "10px", marginBottom: "12px" }}>
        <div>
          <h3 className="font-headline" style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>
            {entry.title}
          </h3>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", background: strength.bg, color: strength.color, padding: "2px 6px", fontWeight: "bold" }}>
            {strength.label}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", background: "#111111", color: "#F9F9F7", padding: "2px 6px" }}>
            ID: {entry.id.slice(0, 6)}
          </span>
        </div>
      </div>

      <div className="font-editorial" style={{ fontSize: "0.9rem", display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginBottom: "16px" }}>
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#737373", display: "block" }}>
            Username / Handle
          </span>
          <span className="font-mono-data" style={{ fontSize: "12px", background: "#F9F9F7", border: "1px solid #E5E5E0", padding: "4px 8px", display: "block", marginTop: "2px" }}>
            {entry.username || "—"}
          </span>
        </div>

        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#737373", display: "block" }}>
            Secret Credential
          </span>
          <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
            <span className="font-mono-data" style={{ fontSize: "12px", background: "#F9F9F7", border: "1px solid #E5E5E0", padding: "4px 8px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {showPassword ? entry.password : "••••••••••••••••"}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ padding: "4px 10px", fontSize: "10px" }}
            >
              {showPassword ? "Hide" : "View"}
            </button>
          </div>
        </div>

        {entry.url && (
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#737373", display: "block" }}>
              Target URL
            </span>
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono-data"
              style={{ fontSize: "12px", color: "#CC0000", textDecoration: "underline", display: "block", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {entry.url}
            </a>
          </div>
        )}

        {entry.notes && (
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#737373", display: "block" }}>
              Editorial Notes
            </span>
            <p style={{ fontSize: "0.85rem", color: "#404040", fontStyle: "italic", margin: "2px 0 0 0", background: "#F9F9F7", padding: "6px 10px", borderLeft: "2px solid #111111" }}>
              {entry.notes}
            </p>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "10px", borderTop: "1px solid #E5E5E0" }}>
        <button onClick={copyPassword} style={{ fontSize: "10px", padding: "6px 12px" }}>
          {copied ? "Copied!" : "Copy Password"}
        </button>
        <button onClick={() => onEdit(entry)} className="secondary-btn" style={{ fontSize: "10px", padding: "6px 12px" }}>
          Edit
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="secondary-btn"
          style={{ fontSize: "10px", padding: "6px 12px", marginLeft: "auto", borderColor: "#CC0000", color: "#CC0000" }}
        >
          Purge
        </button>
      </div>
    </div>
  );
}