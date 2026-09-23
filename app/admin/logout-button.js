"use client";

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-white/10 px-3 py-2 text-sm"
    >
      Sign out
    </button>
  );
}