import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [vaultData, setVaultData] = useState("");
  const [message, setMessage] = useState("");

  async function loadVault() {
    try {
      const result = await invoke<string>(
        "open_vault"
      );

      setVaultData(result);
      setMessage("Vault loaded!");
    } catch (err) {
      setMessage(String(err));
    }
  }

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>Zanpakuto</h1>

      <button
        onClick={loadVault}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
        }}
      >
        Load Vault
      </button>

      <p>{message}</p>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#111",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {vaultData}
      </pre>
    </div>
  );
}

export default App;