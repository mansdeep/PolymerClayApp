import { DIFFICULTY_STYLES, isDifficulty } from "@/lib/difficulty";

export function DifficultyBadge({ value }: { value: string }) {
  const cls = isDifficulty(value)
    ? DIFFICULTY_STYLES[value]
    : "bg-clay-100 text-clay-700 ring-clay-600/20";

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}
    >
      {value}
    </span>
  );
}
