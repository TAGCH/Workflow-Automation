import React, { useState, useEffect } from 'react';

const AnimatedBars = ({
                      totalBars = 40,
                      chartHeight = 200,
                      barWidth = 30,
                      targetHeight = 120,
                  }) => {
    const [bars, setBars] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const generateBars = () => {
            const newBars = Array.from({ length: totalBars }).map(() => {
                const amplitude = Math.random() * 30;
                const baseHeight = targetHeight;
                const color = 'white';

                return {
                    baseHeight: baseHeight,
                    amplitude: amplitude,
                    color: color,
                };
            });

            setBars(newBars);
        };

        const animateBars = () => {
            if (progress < 1) {
                setProgress(prev => Math.min(prev + 0.1, 1));
            }
        };

        generateBars();
        const intervalId = setInterval(animateBars, 1);

        const resizeHandler = () => {
            setProgress(0);
            generateBars();
        };

        window.addEventListener('resize', resizeHandler);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', resizeHandler);
        };
    }, [progress, totalBars]);

    const totalWidth = window.innerWidth;
    const totalBarWidth = totalBars * barWidth;
    const totalSpacing = totalWidth - totalBarWidth;
    const barSpacing = totalSpacing / (totalBars - 1);

    return (
        <svg className="pt-16" width="100%" height={chartHeight} preserveAspectRatio="none">
            {bars.map((bar, index) => (
                <rect
                    key={index}
                    x={index * (barWidth + barSpacing)}
                    y={chartHeight - bar.baseHeight}
                    width={barWidth}
                    height={bar.baseHeight}
                    style={{
                        fill: bar.color,
                        animationDelay: `${index * 0.1}s`,
                    }}
                    className={`bar bar-${index % totalBars}`}
                />
            ))}
        </svg>
    );
};

export default AnimatedBars;
