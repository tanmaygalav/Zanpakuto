import { invoke } from "@tauri-apps/api/core";

export async function unlockVault(
  password: string
) {
  const result = await invoke<string>(
    "unlock_vault",
    {
      password,
    }
  );

  return JSON.parse(result);
}

export async function saveEntry(
  data: any
) {
  return invoke(
    "save_entry",
    data
  );
}

export async function deleteEntry(
  password: string,
  id: string
) {
  return invoke(
    "delete_entry_command",
    {
      password,
      id,
    }
  );
}

export async function updateEntry(
  password: string,
  entry: any
) {
  return invoke(
    "update_entry_command",
    {
      password,
      entry,
    }
  );
}

export async function refreshVault(
  password: string
) {
  return unlockVault(password);
}