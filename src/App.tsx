import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [masterPassword, setMasterPassword] = useState("");
  const [vaultData, setVaultData] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  async function unlockVault() {
    try {
      const result = await invoke<string>(
        "unlock_vault",
        {
          password: masterPassword,
        }
      );

      setVaultData(JSON.parse(result));
    } catch (err) {
      alert(String(err));
    }
  }

  async function saveEntry() {
    try {
      await invoke("save_entry", {
      masterPassword: masterPassword,
      title: title,
      username: username,
      passwordValue: password,
      url: url,
      notes: notes,
    });

      await unlockVault();

      setTitle("");
      setUsername("");
      setPassword("");
      setUrl("");
      setNotes("");
    } catch (err) {
      alert(String(err));
    }
  }

  async function deleteEntry(id: string) {
    try {
      await invoke(
        "delete_entry_command",
        {
          password: masterPassword,
          id: id,
        }
      );

      await unlockVault();
    } catch (err) {
      alert(String(err));
    }
  }

  return (
    <div
      style={{
        background: "#000",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Zanpakuto</h1>

      <input
        type="password"
        placeholder="Master Password"
        value={masterPassword}
        onChange={(e) =>
          setMasterPassword(e.target.value)
        }
        style={{
          width: "300px",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button onClick={unlockVault}>
        Unlock Vault
      </button>

      <hr />

      <h2>Add Password</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="URL"
        value={url}
        onChange={(e) =>
          setUrl(e.target.value)
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={saveEntry}>
        Save Entry
      </button>

      <hr />

      <h2>Stored Passwords</h2>

      {vaultData?.entries?.map(
        (entry: any) => (
          <div
            key={entry.id}
            style={{
              border: "1px solid #333",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >
            <h3>{entry.title}</h3>

            <p>
              Username:
              {" "}
              {entry.username}
            </p>

            <p>
              Password:
              {" "}
              {entry.password}
            </p>

            <p>
              URL:
              {" "}
              {entry.url}
            </p>

            <p>
              Notes:
              {" "}
              {entry.notes}
            </p>

            <button
              onClick={() =>
                deleteEntry(entry.id)
              }
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default App;