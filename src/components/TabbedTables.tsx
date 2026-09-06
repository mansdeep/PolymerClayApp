"use client";

import { useState } from "react";
import { DataTable, type Column, type Row } from "@/components/DataTable";

export interface TabDef {
  id: string;
  label: string;
  columns: Column[];
  rows: Row[];
}

export function TabbedTables({ tabs }: { tabs: TabDef[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Reference tables"
        className="flex gap-1 border-b border-clay-200"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(tab.id)}
              className={`-mb-px rounded-t-md border-b-2 px-4 py-2 text-sm font-medium ${
                selected
                  ? "border-clay-600 text-clay-800"
                  : "border-transparent text-clay-500 hover:text-clay-700"
              }`}
            >
              {tab.label}{" "}
              <span className="text-xs text-clay-400">({tab.rows.length})</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <DataTable
          key={active.id}
          columns={active.columns}
          rows={active.rows}
        />
      </div>
    </div>
  );
}
