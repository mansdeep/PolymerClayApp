"use client";

import { useMemo, useState } from "react";
import { DIFFICULTIES } from "@/lib/difficulty";
import { DifficultyBadge } from "@/components/DifficultyBadge";

export type ColumnKind = "text" | "difficulty";

export interface Column {
  key: string;
  label: string;
  kind?: ColumnKind;
  /** Tailwind width hint for the column, e.g. "w-48". */
  className?: string;
}

export type Row = Record<string, string>;

export function DataTable({
  columns,
  rows,
}: {
  columns: Column[];
  rows: Row[];
}) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const active = Object.entries(filters).filter(([, v]) => v.trim() !== "");
    if (active.length === 0) return rows;

    return rows.filter((row) =>
      active.every(([key, value]) => {
        const cell = (row[key] ?? "").toLowerCase();
        const needle = value.trim().toLowerCase();
        const column = columns.find((c) => c.key === key);
        if (column?.kind === "difficulty") {
          return cell === needle;
        }
        return cell.includes(needle);
      }),
    );
  }, [filters, rows, columns]);

  function setFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const hasActiveFilter = Object.values(filters).some((v) => v.trim() !== "");

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-clay-600">
        <span>
          Showing {filtered.length} of {rows.length}
        </span>
        {hasActiveFilter && (
          <button
            onClick={() => setFilters({})}
            className="font-medium text-clay-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-clay-200 bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-clay-200 bg-clay-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 font-semibold text-clay-800 ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
            <tr className="border-b border-clay-200 bg-clay-50">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 align-top">
                  {col.kind === "difficulty" ? (
                    <select
                      aria-label={`Filter by ${col.label}`}
                      value={filters[col.key] ?? ""}
                      onChange={(e) => setFilter(col.key, e.target.value)}
                      className="w-full rounded border border-clay-300 bg-white px-2 py-1 text-xs font-normal outline-none focus:border-clay-500"
                    >
                      <option value="">All</option>
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      aria-label={`Search ${col.label}`}
                      placeholder={`Search ${col.label.toLowerCase()}…`}
                      value={filters[col.key] ?? ""}
                      onChange={(e) => setFilter(col.key, e.target.value)}
                      className="w-full rounded border border-clay-300 bg-white px-2 py-1 text-xs font-normal outline-none focus:border-clay-500"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-clay-500"
                >
                  No rows match your search.
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="border-b border-clay-100 last:border-0 align-top hover:bg-clay-50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-3 text-clay-700">
                      {col.kind === "difficulty" ? (
                        <DifficultyBadge value={row[col.key] ?? ""} />
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
