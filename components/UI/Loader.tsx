import { BiLoaderCircle } from "react-icons/bi";

export default function Loader() {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[var(--bg)] `}
    >
      <div className="relative">
        <BiLoaderCircle
          className={`w-12 h-12 rounded-full text-[var(--text)] border-4 animate-spin`}
        />
      </div>
    </div>
  );
}
