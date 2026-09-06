"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FIELDS = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Address", type: "text", autoComplete: "street-address" },
  {
    name: "password",
    label: "Password (min 8 characters)",
    type: "password",
    autoComplete: "new-password",
  },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/browse");
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Sign-up failed.");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-clay-800">Create your account</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-clay-700"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required
              className="mt-1 w-full rounded-md border border-clay-300 bg-white px-3 py-2 text-clay-900 outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500"
            />
          </div>
        ))}

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-clay-600 px-4 py-2.5 font-medium text-white hover:bg-clay-700 disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-clay-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-clay-700 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
