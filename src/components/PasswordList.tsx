import { useState } from "react";

import PasswordCard from "./PasswordCard";

import { PasswordEntry }
from "../types/PasswordEntry";

interface Props {
  entries: PasswordEntry[];

  onEdit: (
    entry: PasswordEntry
  ) => void;

  onDelete: (
    id: string
  ) => void;
}

export default function PasswordList({
  entries,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] =
    useState("");

  const filteredEntries =
    entries.filter((entry) =>
      entry.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <>
      <input
        placeholder="Search passwords..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {filteredEntries.map(
        (entry) => (
          <PasswordCard
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      )}
    </>
  );
}