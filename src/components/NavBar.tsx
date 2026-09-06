import Link from "next/link";
import type { SafeUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export function NavBar({ user }: { user: SafeUser | null }) {
  return (
    <header className="border-b border-clay-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-clay-800">
          🌀 Polymer Clay Inspo
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/browse" className="hover:text-clay-600">
                Browse
              </Link>
              <Link href="/profile" className="hover:text-clay-600">
                {user.name.split(" ")[0] || "Profile"}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-clay-600">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-clay-600 px-3 py-1.5 font-medium text-white hover:bg-clay-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
