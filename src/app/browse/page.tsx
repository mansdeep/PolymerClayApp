import { prisma } from "@/lib/db";
import { TabbedTables, type TabDef } from "@/components/TabbedTables";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const [projects, techniques, finishes] = await Promise.all([
    prisma.project.findMany({ orderBy: { name: "asc" } }),
    prisma.technique.findMany({ orderBy: { name: "asc" } }),
    prisma.finish.findMany({ orderBy: { name: "asc" } }),
  ]);

  const tabs: TabDef[] = [
    {
      id: "projects",
      label: "Projects",
      columns: [
        { key: "name", label: "Name", className: "w-48" },
        { key: "usage", label: "Usage", className: "w-64" },
        { key: "procedure", label: "Making Procedure" },
        { key: "difficulty", label: "Difficulty", kind: "difficulty", className: "w-28" },
      ],
      rows: projects.map((p) => ({
        id: p.id,
        name: p.name,
        usage: p.usage,
        procedure: p.procedure,
        difficulty: p.difficulty,
      })),
    },
    {
      id: "techniques",
      label: "Techniques",
      columns: [
        { key: "name", label: "Technique", className: "w-48" },
        { key: "purpose", label: "What it's for", className: "w-64" },
        { key: "howTo", label: "How to do it" },
        { key: "difficulty", label: "Difficulty", kind: "difficulty", className: "w-28" },
      ],
      rows: techniques.map((t) => ({
        id: t.id,
        name: t.name,
        purpose: t.purpose,
        howTo: t.howTo,
        difficulty: t.difficulty,
      })),
    },
    {
      id: "finishing",
      label: "Finishing",
      columns: [
        { key: "name", label: "Finish", className: "w-48" },
        { key: "result", label: "Result", className: "w-64" },
        { key: "notes", label: "Notes" },
        { key: "difficulty", label: "Difficulty", kind: "difficulty", className: "w-28" },
      ],
      rows: finishes.map((f) => ({
        id: f.id,
        name: f.name,
        result: f.result,
        notes: f.notes,
        difficulty: f.difficulty,
      })),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-clay-800">Browse</h1>
      <p className="mt-1 text-sm text-clay-600">
        Switch tabs, then search any column. The Difficulty column filters by
        level.
      </p>
      <div className="mt-6">
        <TabbedTables tabs={tabs} />
      </div>
    </div>
  );
}
