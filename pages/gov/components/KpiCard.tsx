import React, { useState, useEffect } from 'react';

// A simple hook for counting animation
const useCountUp = (end: number, duration: number = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const endValue = end;
        if (start === endValue) {
            setCount(endValue);
            return;
        };

        const totalFrames = duration / (1000 / 60); // Assuming 60fps
        const increment = endValue / totalFrames;
        let animationFrameId: number;

        const step = () => {
            start += increment;
            if (start < endValue) {
                setCount(Math.ceil(start));
                animationFrameId = requestAnimationFrame(step);
            } else {
                setCount(endValue);
            }
        };
        
        animationFrameId = requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration]);

    return count;
};


interface KpiCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'red';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
        green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500' },
        red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-500' },
    };

    const isNumeric = typeof value === 'number';
    const animatedValue = isNumeric ? useCountUp(value) : null;

    return (
        <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4 tilt-card hover:shadow-lg border-t-4 ${colorClasses[color].border}`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color].bg} ${colorClasses[color].text}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{isNumeric ? animatedValue : value}</p>
            </div>
        </div>
    );
};

export default KpiCard;