import { RiLoader3Line } from 'react-icons/ri';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <RiLoader3Line 
        className={`${sizeClasses[size]} text-[var(--text)] animate-spin`}
      />
      {text && (
        <span className="text-[var(--text)] opacity-70">{text}</span>
      )}
    </div>
  );
}