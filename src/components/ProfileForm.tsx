"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileFields {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function ProfileForm({ user }: { user: ProfileFields }) {
  const router = useRouter();
  const [form, setForm] = useState(user);
  const [status, setStatus] = useState<
    { type: "idle" | "ok" | "error"; message?: string }
  >({ type: "idle" });
  const [loading, setLoading] = useState(false);

  function update(field: keyof ProfileFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStatus({ type: "idle" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "idle" });

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        address: form.address,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (res.ok) {
      setStatus({ type: "ok", message: "Profile saved." });
      router.refresh();
    } else {
      setStatus({ type: "error", message: data.error ?? "Could not save." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-clay-700">
          Full name
        </label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-clay-300 bg-white px-3 py-2 outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-clay-700">
          Email
        </label>
        <input
          id="email"
          value={form.email}
          disabled
          className="mt-1 w-full cursor-not-allowed rounded-md border border-clay-200 bg-clay-100 px-3 py-2 text-clay-500"
        />
        <p className="mt-1 text-xs text-clay-500">Email can't be changed.</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-clay-700">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-clay-300 bg-white px-3 py-2 outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-clay-700"
        >
          Address
        </label>
        <input
          id="address"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-clay-300 bg-white px-3 py-2 outline-none focus:border-clay-500 focus:ring-1 focus:ring-clay-500"
        />
      </div>

      {status.type !== "idle" && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            status.type === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-clay-600 px-4 py-2.5 font-medium text-white hover:bg-clay-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
