import { useState } from "react";
import { PasswordEntry } from "../types/PasswordEntry";

interface Props {
  entry: PasswordEntry;

  onEdit: (
    entry: PasswordEntry
  ) => void;

  onDelete: (
    id: string
  ) => void;
}

export default function PasswordCard({
  entry,
  onEdit,
  onDelete,
}: Props) {
  const [showPassword, setShowPassword] =
    useState(false);

  async function copyPassword() {
    await navigator.clipboard.writeText(
      entry.password
    );
  }

  return (
    <div
      style={{
        border: "1px solid #333",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "10px",
        background: "#111",
      }}
    >
      <h3>{entry.title}</h3>

      <p>
        <strong>Username:</strong>{" "}
        {entry.username}
      </p>

      <p>
        <strong>Password:</strong>{" "}
        {showPassword
          ? entry.password
          : "••••••••••"}
      </p>

      <p>
        <strong>URL:</strong>{" "}
        {entry.url}
      </p>

      <p>
        <strong>Notes:</strong>{" "}
        {entry.notes}
      </p>

      <button
        onClick={() =>
          setShowPassword(
            !showPassword
          )
        }
      >
        {showPassword
          ? "Hide"
          : "Show"}
      </button>

      <button
        onClick={copyPassword}
      >
        Copy
      </button>

      <button
        onClick={() =>
          onEdit(entry)
        }
      >
        Edit
      </button>

      <button
        onClick={() =>
          onDelete(entry.id)
        }
      >
        Delete
      </button>
    </div>
  );
}