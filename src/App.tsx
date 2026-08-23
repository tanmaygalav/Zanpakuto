import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { useState } from "react";
import VaultUnlock from "./components/VaultUnlock";
import VaultSetup from "./components/VaultSetup";
import PasswordList from "./components/PasswordList";
import {
  unlockVault as unlockVaultApi,
  saveEntry as saveEntryApi,
  deleteEntry as deleteEntryApi,
  updateEntry as updateEntryApi,
  deleteVaultFile,
} from "./services/vaultApi";
import { PasswordEntry } from "./types/PasswordEntry";

interface VaultData {
  version: number;
  entries: PasswordEntry[];
}

export default function App() {
  const [masterPassword, setMasterPassword] = useState("");
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState("");
  
  // Toggle between "unlock existing" or "create new"
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");



  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const pending: Array<{ title: string; username: string; password: string; url: string }> = await invoke("get_pending_credentials");
        if (pending && pending.length > 0) {
          const latest = pending[pending.length - 1];
          setTitle(latest.title);
          setUsername(latest.username);
          setPassword(latest.password);
          setUrl(latest.url);
          console.log("Auto-filled credential from browser extension!");
        }
      } catch (err) {
        // Ignore if locked or offline
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  async function unlockVault() {
    try {
      const data = await unlockVaultApi(masterPassword);
      setVaultData(data);
    } catch (err) {
      alert("Failed to unlock vault. If you haven't created one yet, click 'Initialize New Vault' below.");
    }
  }

  async function saveEntry() {
    try {
      await saveEntryApi({
        masterPassword,
        title,
        username,
        passwordValue: password,
        url,
        notes,
      });
      // Re-fetch or reload vault data after save
      const data = await unlockVaultApi(masterPassword);
      setVaultData(data);
      clearForm();
    } catch (err) {
      alert(String(err));
    }
  }

  async function updateEntry() {
    try {
      await updateEntryApi(masterPassword, {
        id: editingId,
        title,
        username,
        password,
        url,
        notes,
        created_at: "",
        updated_at: new Date().toISOString(),
      });
      const data = await unlockVaultApi(masterPassword);
      setVaultData(data);
      clearForm();
    } catch (err) {
      alert(String(err));
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm("Are you sure you want to purge this record?")) return;
    try {
      await deleteEntryApi(masterPassword, id);
      const data = await unlockVaultApi(masterPassword);
      setVaultData(data);
    } catch (err) {
      alert(String(err));
    }
  }

  async function handleResetVault() {
    if (!confirm("WARNING: This will completely destroy the vault file on disk. All records will be lost forever. Proceed?")) return;
    try {
      await deleteVaultFile();
      setVaultData(null);
      setMasterPassword("");
      alert("Vault file destroyed.");
    } catch (err) {
      alert(String(err));
    }
  }

  function handleLockVault() {
    setVaultData(null);
    setMasterPassword("");
  }

  function clearForm() {
    setEditingId("");
    setTitle("");
    setUsername("");
    setPassword("");
    setUrl("");
    setNotes("");
  }

  function startEditing(entry: PasswordEntry) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setUsername(entry.username);
    setPassword(entry.password);
    setUrl(entry.url);
    setNotes(entry.notes);
  }

  function generateSecurePassword() {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const length = 18;
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    let retVal = "";
    for (let i = 0; i < length; i++) {
      retVal += charset[randomValues[i] % charset.length];
    }
    setPassword(retVal);
  }

  function evaluatePasswordStrength(pass: string) {
    if (!pass) return { label: "Empty", color: "#737373" };
    let score = 0;
    if (pass.length >= 12) score++;
    if (pass.length >= 16) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score >= 4) return { label: "Cryptographic Grade", color: "#111111" };
    if (score === 3) return { label: "Moderate", color: "#b45309" };
    return { label: "Weak / Vulnerable", color: "#CC0000" };
  }

  const filteredEntries =
    vaultData?.entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.username.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="newsprint-container">
      {/* Newspaper Masthead */}
      <header style={{ borderBottom: "4px solid #111111", paddingBottom: "16px", marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "1px solid #111111", paddingBottom: "8px", marginBottom: "16px", color: "#525252" }}>
          <span>Vol. I No. 1</span>
          <span>{currentDate}</span>
          <span style={{ color: "#CC0000", fontWeight: "bold" }}>Secure Edition</span>
        </div>
        <h1 className="font-headline" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, textAlign: "center", textTransform: "uppercase", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
          Zanpakuto Dispatch
        </h1>
        <p style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#737373", margin: 0 }}>
          The Absolute Record of Encrypted Credentials & Secrets
        </p>

        {/* Session Controls when Unlocked */}
        {vaultData && (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px" }}>
            <button onClick={handleLockVault} className="secondary-btn" style={{ fontSize: "10px", padding: "4px 10px" }}>
              Lock Vault Session
            </button>
            <button onClick={handleResetVault} className="secondary-btn" style={{ fontSize: "10px", padding: "4px 10px", borderColor: "#CC0000", color: "#CC0000" }}>
              Destroy & Reset Vault
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {!vaultData ? (
          <div>
            {isCreatingNew ? (
              <div>
                <VaultSetup onVaultCreated={() => setIsCreatingNew(false)} />
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <button onClick={() => setIsCreatingNew(false)} className="secondary-btn" style={{ fontSize: "11px" }}>
                    &larr; Back to Unlock Existing Vault
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                  <VaultUnlock
                    masterPassword={masterPassword}
                    setMasterPassword={setMasterPassword}
                    unlockVault={unlockVault}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button onClick={() => setIsCreatingNew(true)} className="secondary-btn" style={{ fontSize: "11px" }}>
                    Need a new vault? Initialize one here &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="newsprint-grid">
            {/* Left Column: Form Controls */}
            <div className="newsprint-box">
              <div style={{ borderBottom: "1px solid #111111", paddingBottom: "12px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="font-headline" style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                  {editingId ? "Edit Record" : "New Transmission"}
                </h2>
                {editingId && (
                  <button onClick={clearForm} className="secondary-btn" style={{ padding: "4px 8px", fontSize: "10px" }}>
                    Cancel
                  </button>
                )}
              </div>

              <div className="font-editorial">
                <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Title / Service Name *
                </label>
                <input
                  placeholder="e.g. GitHub Repository"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Username / Identity
                </label>
                <input
                  placeholder="e.g. developer@local"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Password / Secret *
                </label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                  <input
                    type="text"
                    placeholder="Secure password value..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ flex: 1, margin: 0 }}
                  />
                  <button
                    type="button"
                    onClick={generateSecurePassword}
                    style={{ padding: "0 12px", fontSize: "10px", whiteSpace: "nowrap", margin: 0 }}
                  >
                    Generate Key
                  </button>
                </div>
                {/* Live Strength Indicator */}
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#737373" }}>Entropy Rating:</span>
                  <span style={{ fontWeight: "bold", color: evaluatePasswordStrength(password).color }}>
                    {evaluatePasswordStrength(password).label}
                  </span>
                </div>

                <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Target URL
                </label>
                <input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />

                <label style={{ display: "block", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Notes & Metadata
                </label>
                <textarea
                  placeholder="Optional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />

                <button
                  onClick={editingId ? updateEntry : saveEntry}
                  style={{ width: "100%", marginTop: "8px", padding: "12px" }}
                >
                  {editingId ? "Commit Updates →" : "Publish Entry →"}
                </button>
              </div>
            </div>

            {/* Right Column: Database Feed */}
            <div className="newsprint-box" style={{ position: "static" }}>
              <div style={{ borderBottom: "1px solid #111111", paddingBottom: "12px", marginBottom: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <h2 className="font-headline" style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                  Indexed Records ({filteredEntries.length})
                </h2>
                <input
                  placeholder="Global search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "180px", margin: 0, padding: "6px 10px", fontSize: "12px" }}
                />
              </div>

              <PasswordList
                entries={filteredEntries}
                onEdit={startEditing}
                onDelete={deleteEntry}
              />
            </div>
          </div>
        )}
      </main>

      {/* Newspaper Footer */}
      <footer style={{ borderTop: "2px solid #111111", marginTop: "48px", paddingTop: "16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#525252", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        <p>Zanpakuto Publishing • Built with Tauri & React • All Rights Reserved</p>
      </footer>
    </div>
  );
}