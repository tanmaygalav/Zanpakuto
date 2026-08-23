import { useState } from "react";
import PasswordCard from "./PasswordCard";
import { PasswordEntry } from "../types/PasswordEntry";

interface Props {
  entries: PasswordEntry[];
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export default function PasswordList({
  entries,
  onEdit,
  onDelete,
}: Props) {
  const [filterQuery, setFilterQuery] = useState("");

  const localFiltered = entries.filter((entry) =>
    entry.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    entry.username.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <input
          placeholder="Filter indexed records..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {localFiltered.length === 0 ? (
        <div className="border border-dashed border-[#111111] p-8 text-center font-editorial italic text-neutral-500">
          No records found in current edition print queue.
        </div>
      ) : (
        <div className="space-y-4">
          {localFiltered.map((entry) => (
            <PasswordCard
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}