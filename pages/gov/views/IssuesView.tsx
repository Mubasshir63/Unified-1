

import React, { useState, useMemo } from 'react';
import { DetailedReport, ReportStatus } from '../../../types';
import { CalendarIcon, LocationMarkerIcon, MyReportsIcon, SearchIcon } from '../../../components/icons/NavIcons';

interface IssuesViewProps {
    issues: DetailedReport[];
    onSelectIssue: (issue: DetailedReport) => void;
    isLoading: boolean;
}

const getPriorityPill = (priority?: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (priority) {
        case 'Critical': return { text: 'text-red-700', bg: 'bg-red-100' };
        case 'High': return { text: 'text-orange-700', bg: 'bg-orange-100' };
        case 'Medium': return { text: 'text-yellow-700', bg: 'bg-yellow-100' };
        default: return { text: 'text-gray-700', bg: 'bg-gray-100' };
    }
};

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
    const statusStyles = {
        [ReportStatus.Emergency]: 'bg-red-100 text-red-800',
        [ReportStatus.Resolved]: 'bg-green-100 text-green-800',
        [ReportStatus.UnderReview]: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const IssueCard: React.FC<{ issue: DetailedReport, onClick: () => void, onSelect: () => void, isSelected: boolean }> = ({ issue, onClick, onSelect, isSelected }) => {
    const priorityClasses = getPriorityPill(issue.priority);
    return (
        <div className={`bg-white rounded-lg border shadow-sm transition-all flex items-start p-4 space-x-4 ${isSelected ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200 hover:border-green-300'}`}>
            <input 
                type="checkbox"
                checked={isSelected}
                onChange={onSelect}
                onClick={e => e.stopPropagation()}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <div onClick={onClick} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-800">{issue.title}</p>
                    <StatusBadge status={issue.status} />
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span className={`px-2 py-0.5 font-semibold rounded-full ${priorityClasses.bg} ${priorityClasses.text}`}>{issue.priority || 'Low'}</span>
                        <div className="flex items-center space-x-1"><CalendarIcon /> <span>{new Date(issue.date).toLocaleDateString()}</span></div>
                        <div className="flex items-center space-x-1"><LocationMarkerIcon /> <span>{issue.location.split(',')[0]}</span></div>
                    </div>
                    <span className="font-semibold text-green-600">View Details &rarr;</span>
                </div>
            </div>
        </div>
    );
};

const IssueCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-start space-x-4 animate-shimmer">
        <div className="mt-1 h-5 w-5 rounded bg-gray-200"></div>
        <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    </div>
);


const IssuesView: React.FC<IssuesViewProps> = ({ issues, onSelectIssue, isLoading }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'Low' | 'Medium' | 'High' | 'Critical'>('all');
    const [selectedIssues, setSelectedIssues] = useState<number[]>([]);

    const filteredIssues = useMemo(() => {
        return issues
            .filter(issue => {
                if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
                if (priorityFilter !== 'all' && (issue.priority || 'Low') !== priorityFilter) return false;
                if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) && !issue.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [issues, searchQuery, statusFilter, priorityFilter]);

    const handleSelectIssue = (issueId: number) => {
        setSelectedIssues(prev => 
            prev.includes(issueId) ? prev.filter(id => id !== issueId) : [...prev, issueId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIssues(filteredIssues.map(i => i.id));
        } else {
            setSelectedIssues([]);
        }
    };

    const BulkActionBar = () => (
      <div className="bg-slate-800 text-white rounded-lg p-3 flex justify-between items-center mb-4 animate-fadeInUp shadow-lg">
        <p className="font-semibold">{selectedIssues.length} issue(s) selected</p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 rounded-md text-sm font-semibold">Assign...</button>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-semibold">Update Status</button>
        </div>
      </div>
    );

    const FilterSelect: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[]; label: string }> = ({ value, onChange, options, label }) => (
        <div>
            <label className="text-xs text-gray-500">{label}</label>
            <select value={value} onChange={onChange} className="w-full bg-white border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm">
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );
    
    if (isLoading) {
        return (
            <div className="p-4 md:p-6 h-full flex flex-col">
                <header className="mb-4 animate-shimmer">
                    <div className="h-11 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-12 bg-gray-200 rounded-md"></div>
                        <div className="h-12 bg-gray-200 rounded-md"></div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto space-y-3 pt-2">
                    <IssueCardSkeleton />
                    <IssueCardSkeleton />
                    <IssueCardSkeleton />
                    <IssueCardSkeleton />
                    <IssueCardSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 h-full flex flex-col animate-fadeInUp">
            <header className="mb-4">
                <div className="relative mb-4">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></div>
                     <input 
                        type="text" 
                        placeholder="Search by title or category..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FilterSelect 
                        label="Filter by Status"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        options={[
                            { value: 'all', label: 'All Statuses' },
                            { value: ReportStatus.UnderReview, label: 'Under Review' },
                            { value: ReportStatus.Resolved, label: 'Resolved' },
                        ]}
                    />
                     <FilterSelect 
                        label="Filter by Priority"
                        value={priorityFilter}
                        onChange={e => setPriorityFilter(e.target.value as any)}
                        options={[
                            { value: 'all', label: 'All Priorities' },
                            { value: 'Critical', label: 'Critical' },
                            { value: 'High', label: 'High' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'Low', label: 'Low' },
                        ]}
                    />
                </div>
            </header>
            {selectedIssues.length > 0 && <BulkActionBar />}
            <div className="flex items-center space-x-2 p-2">
                <input 
                    type="checkbox"
                    id="select-all"
                    onChange={handleSelectAll} 
                    checked={filteredIssues.length > 0 && selectedIssues.length === filteredIssues.length}
                    className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="select-all" className="text-sm font-semibold text-gray-600">Select All</label>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pt-2">
                {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => <IssueCard key={issue.id} issue={issue} onClick={() => onSelectIssue(issue)} onSelect={() => handleSelectIssue(issue.id)} isSelected={selectedIssues.includes(issue.id)} />)
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <MyReportsIcon className="w-12 h-12 mx-auto text-gray-400" />
                        <h3 className="mt-2 text-lg font-semibold">No Issues Found</h3>
                        <p>No issues match the current filters. Try adjusting your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssuesView;