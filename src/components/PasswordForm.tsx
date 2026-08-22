import { PasswordEntry } from "../types/PasswordEntry";

interface Props {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;

  setTitle: (value: string) => void;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setUrl: (value: string) => void;
  setNotes: (value: string) => void;

  editingId: string;

  onSave: () => void;
  onUpdate: () => void;
}

export default function PasswordForm({
  title,
  username,
  password,
  url,
  notes,

  setTitle,
  setUsername,
  setPassword,
  setUrl,
  setNotes,

  editingId,

  onSave,
  onUpdate,
}: Props) {
  return (
    <>
      <h2>
        {editingId
          ? "Update Password"
          : "Add Password"}
      </h2>

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

      <button
        onClick={
          editingId
            ? onUpdate
            : onSave
        }
      >
        {
          editingId
            ? "Update Entry"
            : "Save Entry"
        }
      </button>
    </>
  );
}