import {RiLoader3Line } from 'react-icons/ri';

export default function Loader() {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[var(--bg)] `}
    >
      <div className="relative">
        <RiLoader3Line 
          className={`w-12 h-12 text-[var(--text)] animate-spin`}
        />
      </div>
    </div>
  );
}
