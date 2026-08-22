import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  async function createVault() {
    try {
      const res = await invoke<string>(
        "create_vault",
        {
          password,
        }
      );

      setResult(
        "CREATE SUCCESS\n\n" + res
      );
    } catch (err) {
      setResult(String(err));
    }
  }

  async function unlockVault() {
    try {
      const res = await invoke<string>(
        "unlock_vault",
        {
          password,
        }
      );

      setResult(
        "UNLOCK SUCCESS\n\n" + res
      );
    } catch (err) {
      setResult(
        "UNLOCK FAILED\n\n" +
          String(err)
      );
    }
  }

  return (
    <div
      style={{
        background: "#000",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1>Zanpakuto Test</h1>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        style={{
          width: "300px",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button
        onClick={createVault}
        style={{
          marginRight: "10px",
          padding: "10px 20px",
        }}
      >
        Create Vault
      </button>

      <button
        onClick={unlockVault}
        style={{
          padding: "10px 20px",
        }}
      >
        Unlock Vault
      </button>

      <br />
      <br />

      <pre
        style={{
          background: "#111",
          padding: "20px",
          borderRadius: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>
    </div>
  );
}

export default App;