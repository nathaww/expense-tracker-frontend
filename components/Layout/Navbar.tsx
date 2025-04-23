"use client";

import { useAuth } from "@/providers/AuthProvider";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-[var(--bg)] border-b border-[var(--border-color)]">
      <div className="text-lg font-bold text-[var(--text)]">Expense Tracker</div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-[var(--text)] hover:bg-[var(--bgSecondary)] rounded-[var(--border-radius)] transition-colors"
      >
        <FiLogOut />
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
