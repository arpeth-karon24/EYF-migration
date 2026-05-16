import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-container px-4 py-16">
      <h1 className="font-montserrat text-2xl font-bold text-white">Admin</h1>
      <p className="mt-4 max-w-xl text-sm text-white/80">
        Supabase-authenticated dashboard shell. Wire `createSupabaseServerClient()` in a Route Handler or Server Action and
        protect this route with middleware once environment variables are configured.
      </p>
    </div>
  );
}
