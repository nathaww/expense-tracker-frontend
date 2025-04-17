export default function Loader() {
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[var(--bg)] `}>
      <div className="relative">
        <div className={`w-12 h-12 rounded-full border-4 animate-spin`}></div>
      </div>
    </div>
  );
}