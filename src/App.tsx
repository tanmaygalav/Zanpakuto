import { useState } from "react";
import VaultUnlock from "./components/VaultUnlock";
import PasswordList from "./components/PasswordList";
import {
  unlockVault as unlockVaultApi,
  saveEntry as saveEntryApi,
  deleteEntry as deleteEntryApi,
  updateEntry as updateEntryApi,
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

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  async function unlockVault() {
    try {
      const data = await unlockVaultApi(masterPassword);
      setVaultData(data);
    } catch (err) {
      alert(String(err));
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
      await unlockVault();
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
      await unlockVault();
      clearForm();
    } catch (err) {
      alert(String(err));
    }
  }

  async function deleteEntry(id: string) {
    if (!confirm("Are you sure you want to purge this record?")) return;
    try {
      await deleteEntryApi(masterPassword, id);
      await unlockVault();
    } catch (err) {
      alert(String(err));
    }
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
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {!vaultData ? (
          <div style={{ maxWidth: "480px", margin: "40px auto" }}>
            <VaultUnlock
              masterPassword={masterPassword}
              setMasterPassword={setMasterPassword}
              unlockVault={unlockVault}
            />
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
                <input
                  type="text"
                  placeholder="Secure password value..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

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
            <div className="newsprint-box">
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