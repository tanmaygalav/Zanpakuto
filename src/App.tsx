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

function App() {
  const [masterPassword, setMasterPassword] =
    useState("");

  const [vaultData, setVaultData] =
    useState<VaultData | null>(null);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [url, setUrl] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function unlockVault() {
    try {
      const data =
        await unlockVaultApi(
          masterPassword
        );

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
      await updateEntryApi(
        masterPassword,
        {
          id: editingId,
          title,
          username,
          password,
          url,
          notes,
          created_at: "",
          updated_at:
            new Date().toISOString(),
        }
      );

      await unlockVault();

      clearForm();
    } catch (err) {
      alert(String(err));
    }
  }

  async function deleteEntry(
    id: string
  ) {
    try {
      await deleteEntryApi(
        masterPassword,
        id
      );

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

  function startEditing(
    entry: PasswordEntry
  ) {
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
        entry.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        entry.username
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    ) || [];

  return (
    <div
      style={{
        background: "#000",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        fontFamily:
          "Inter, sans-serif",
      }}
    >
      <h1>
        🔐 Zanpakuto Password
        Manager
      </h1>

      <VaultUnlock
        masterPassword={
          masterPassword
        }
        setMasterPassword={
          setMasterPassword
        }
        unlockVault={
          unlockVault
        }
      />

      <hr />

      <h2>
        {editingId
          ? "Edit Password"
          : "Add Password"}
      </h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        placeholder="URL"
        value={url}
        onChange={(e) =>
          setUrl(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) =>
          setNotes(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={
          editingId
            ? updateEntry
            : saveEntry
        }
      >
        {editingId
          ? "Update Entry"
          : "Save Entry"}
      </button>

      {editingId && (
        <>
          {" "}
          <button
            onClick={
              clearForm
            }
          >
            Cancel
          </button>
        </>
      )}

      <hr />

      <h2>
        Stored Passwords
      </h2>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={{
          width: "300px",
          padding: "10px",
          marginBottom:
            "20px",
        }}
      />

      <PasswordList
        entries={
          filteredEntries
        }
        onEdit={
          startEditing
        }
        onDelete={
          deleteEntry
        }
      />
    </div>
  );
}

export default App;