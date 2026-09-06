import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/browse");

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl font-bold text-clay-800">
        Polymer Clay Inspo
      </h1>
      <p className="mt-4 text-clay-700">
        A searchable reference for polymer clay makers: projects to build,
        techniques to try, and finishing options — each rated Easy, Medium, or
        Hard. Every column is searchable.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/signup"
          className="rounded-md bg-clay-600 px-5 py-2.5 font-medium text-white hover:bg-clay-700"
        >
          Create an account
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-clay-300 px-5 py-2.5 font-medium text-clay-700 hover:bg-clay-100"
        >
          Log in
        </Link>
      </div>
      <p className="mt-6 text-sm text-clay-500">
        You need an account to browse the tables.
      </p>
    </div>
  );
}
