import ThemeSwitcher from "../UI/ThemeSwitcher";
import { useAuth } from '@/providers/AuthProvider';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-[var(--bgSecondary)] text-white">
      <div className="text-lg font-bold text-[var(--text)]">Expense Tracker</div>
      {isAuthenticated && (
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      )}
      <ThemeSwitcher />
    </nav>
  );
};

export default Navbar;
