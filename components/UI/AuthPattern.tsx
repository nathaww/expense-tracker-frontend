'use client';

const PatternSVG = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="80" 
    height="105" 
    viewBox="0 0 80 105" 
    className={className}
  >
    <g fillRule="evenodd">
      <g fill="currentColor">
        <path d="M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z" />
      </g>
    </g>
  </svg>
);

export default function AuthPattern() {
  // Calculate how many patterns we need to fill the screen
  const patternsPerRow = 8;
  const rowsNeeded = 12;
  const totalPatterns = patternsPerRow * rowsNeeded;
    const patterns = Array.from({ length: totalPatterns }, (_, i) => ({
    id: i,
    row: Math.floor(i / patternsPerRow),
    col: i % patternsPerRow,
    opacity: 0.2 + (Math.random() * 0.4)
  }));

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[var(--bg)] via-[var(--bgSecondary)]/20 to-[var(--bg)]">
      {/* Static gradient overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-15"
        style={{
          background: `linear-gradient(135deg, 
            var(--color-primary)15, 
            transparent 30%, 
            var(--color-secondary)10 50%, 
            transparent 70%, 
            var(--color-tertiary)08)`
        }}
      />
        {/* Main pattern grid with marquee animation */}
      <div className="absolute inset-0 text-[var(--text)] opacity-40">
        <div className="flex h-full">
          {Array.from({ length: patternsPerRow }, (_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 animate-marquee-column"
              style={{
                animationDelay: `${colIndex * -0.5}s`,
                animationDuration: `10s`
              }}
            >
              <div className="flex flex-col" style={{ height: '200%' }}>
                {/* Create enough patterns for seamless infinite scroll */}
                {Array.from({ length: rowsNeeded * 2 }, (_, rowIndex) => {
                  const patternIndex = (rowIndex % rowsNeeded) * patternsPerRow + colIndex;
                  const pattern = patterns[patternIndex];
                  return (
                    <div
                      key={rowIndex}
                      className="flex items-center justify-center"
                      style={{
                        height: `${100 / (rowsNeeded * 2)}%`,
                        opacity: pattern?.opacity || 0.3
                      }}
                    >
                      <PatternSVG className="w-full h-full max-w-[60px] max-h-[80px]" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
