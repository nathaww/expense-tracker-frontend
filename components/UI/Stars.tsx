

const Stars = () => {
    return (
        <div className="absolute inset-0 overflow-hidden transition-all will-change-transform">
            {Array.from({ length: 250 }).map((_, index) => {
                const size = Math.random() * 3 + 1; // Random size between 1px and 4px
                const top = Math.random() * 100; // Random position between 0% and 100%
                const left = Math.random() * 100; // Random position between 0% and 100%
                const animationDelay = Math.random() * 5; // Random delay between 0s and 5s
                const animationDuration = Math.random() * 3 + 2; // Random duration between 2s and 5s

                return (
                    <div
                        key={index}
                        className="fixed rounded-full bg-[var(--text)] opacity-70 animate-pulse"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            top: `${top}%`,
                            left: `${left}%`,
                            animation: `custom-pulse ${animationDuration}s ${animationDelay}s infinite`,
                        }}
                    />
                );
            })}
        </div>
    )
}

export default Stars