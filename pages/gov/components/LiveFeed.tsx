import React from 'react';
import type { DetailedReport } from '../../../types';
import { ReportStatus } from '../../../types';

interface LiveFeedProps {
  issues: DetailedReport[];
  onItemClick: (issue: DetailedReport) => void;
  onAssignClick: (issue: DetailedReport) => void;
}

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
};

const getPriorityPill = (priority?: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (priority) {
        case 'Critical': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">Critical</span>;
        case 'High': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">High</span>;
        case 'Medium': return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Medium</span>;
        default: return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">Low</span>;
    }
};

const LiveFeed: React.FC<LiveFeedProps> = ({ issues, onItemClick, onAssignClick }) => {
    const openIssues = issues
        .filter(issue => issue.status !== ReportStatus.Resolved)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white h-full flex flex-col rounded-lg shadow-sm border border-gray-200">
            <h2 className="p-4 text-lg font-bold text-gray-800 border-b border-gray-200">Live Feed</h2>
            <div className="flex-1 overflow-y-auto">
                {openIssues.map((issue, index) => (
                    <div 
                        key={issue.id} 
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${index < 10 ? 'animate-fadeInUp' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-gray-800 text-sm leading-tight flex-1 pr-2">{issue.title}</p>
                            {getPriorityPill(issue.priority)}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{issue.category} &bull; {timeSince(issue.date)}</p>
                        <div className="flex items-center space-x-2">
                             <button onClick={() => onItemClick(issue)} className="text-xs font-semibold text-blue-600 hover:underline">Details</button>
                             <span className="text-gray-300">|</span>
                             <button onClick={() => onAssignClick(issue)} className="text-xs font-semibold text-green-600 hover:underline">Assign</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveFeed;