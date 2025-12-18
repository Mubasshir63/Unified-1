import React, { useMemo } from 'react';
import type { DetailedReport } from '../../../types';

const colors = ['bg-teal-500', 'bg-sky-500', 'bg-indigo-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-slate-500'];

const IssueCategoryChart: React.FC<{ issues: DetailedReport[] }> = ({ issues }) => {
    const categoryData = useMemo(() => {
        const counts = issues.reduce((acc: Record<string, number>, issue) => {
            acc[issue.category] = (acc[issue.category] || 0) + 1;
            return acc;
        }, {});

        // Fix: Explicitly cast the result of Object.values to number[] to ensure `total` is correctly inferred as a number.
        const total = (Object.values(counts) as number[]).reduce((sum, count) => sum + count, 0);

        // Fix: Explicitly cast the result of Object.entries to [string, number][] to ensure `count` is inferred as a number in sort and map.
        const sorted = (Object.entries(counts) as [string, number][])
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 7); // Show top 7 categories

        return sorted.map(([name, count], index) => ({
            name,
            count,
            percentage: total > 0 ? Math.max(1, (count / total) * 100) : 0,
            color: colors[index % colors.length]
        }));
    }, [issues]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 flex-shrink-0">Issues by Category</h3>
            <div className="space-y-3 flex-1 overflow-y-auto">
                {categoryData.map(category => (
                    <div key={category.name} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-gray-700">{category.name}</span>
                            <span className="font-medium text-gray-500">{category.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className={`${category.color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
                                style={{ width: `${category.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IssueCategoryChart;