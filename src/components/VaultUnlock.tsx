interface Props {
  masterPassword: string;
  setMasterPassword: (
    value: string
  ) => void;

  unlockVault: () => void;
}

export default function VaultUnlock({
  masterPassword,
  setMasterPassword,
  unlockVault,
}: Props) {
  return (
    <>
      <input
        type="password"
        placeholder="Master Password"
        value={masterPassword}
        onChange={(e) =>
          setMasterPassword(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={unlockVault}
      >
        Unlock Vault
      </button>
    </>
  );
}