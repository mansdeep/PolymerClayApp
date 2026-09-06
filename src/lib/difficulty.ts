export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && (DIFFICULTIES as readonly string[]).includes(value);
}

/** Tailwind classes for the difficulty pill. */
export const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-800 ring-green-600/20",
  Medium: "bg-amber-100 text-amber-800 ring-amber-600/20",
  Hard: "bg-rose-100 text-rose-800 ring-rose-600/20",
};
