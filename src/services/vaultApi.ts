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


export async function createVault(password: string): Promise<string> {
  return await invoke("create_vault", { password });
}

export async function deleteVaultFile(): Promise<string> {
  return await invoke("delete_vault_file");
}