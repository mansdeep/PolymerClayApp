import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/profile");

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-clay-800">Your profile</h1>
      <p className="mt-1 text-sm text-clay-600">
        Member since {user.createdAt.toLocaleDateString()}
      </p>
      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        }}
      />
    </div>
  );
}
