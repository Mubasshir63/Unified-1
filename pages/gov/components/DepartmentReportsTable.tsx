
import React from 'react';
import { DetailedReport, ReportStatus } from '../../../types';
import { CalendarIcon, LocationMarkerIcon, SearchIcon } from '../../../components/icons/NavIcons';

interface DepartmentReportsTableProps {
    title: string;
    issues: DetailedReport[];
    isLoading: boolean;
}

const TableSkeleton: React.FC = () => (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 animate-shimmer">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-700 rounded w-full"></div>
            ))}
        </div>
    </div>
);

const DepartmentReportsTable: React.FC<DepartmentReportsTableProps> = ({ title, issues, isLoading }) => {
    if (isLoading) return <TableSkeleton />;

    const sortedIssues = [...issues].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const getStatusColor = (status: ReportStatus) => {
        switch (status) {
            case ReportStatus.Resolved: return 'text-green-400 bg-green-400/10 border-green-400/20';
            case ReportStatus.UnderReview: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case ReportStatus.Emergency: return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10';
        }
    };

    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h3 className="font-bold text-slate-200 text-lg mb-4 flex items-center">
                {title}
                <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">{issues.length} Total</span>
            </h3>
            
            {issues.length === 0 ? (
                 <div className="text-center py-8 text-slate-500">
                    <p>No active citizen reports for this department.</p>
                 </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th className="px-4 py-3">Issue</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedIssues.map((issue) => (
                                <tr key={issue.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-4 py-3 font-medium text-slate-200">
                                        {issue.title}
                                        <div className="text-xs text-slate-500">{issue.category}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <LocationMarkerIcon className="w-3 h-3 mr-1 text-slate-500"/>
                                            <span className="truncate max-w-[150px]">{issue.location.split(',')[0]}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">
                                        {new Date(issue.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-3 text-center">
                        <button className="text-xs text-teal-400 hover:text-teal-300 font-semibold">View All Reports &rarr;</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentReportsTable;
