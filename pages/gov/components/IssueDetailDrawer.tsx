import React, { useState, useEffect } from 'react';
import type { DetailedReport } from '../../../types';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { ReportStatus } from '../../../types';
import { DocumentTextIcon, MagnifyingGlassIcon, UserCircleIcon, CheckCircleIcon, InfoIcon, AiAssistantIcon } from '../../../components/icons/NavIcons';
import * as mockApi from '../../../api/mockApi';


const mockOfficers = [ 'Unassigned', 'Field Officer A', 'Field Officer B', 'Water Dept', 'Sanitation Dept', 'Electrical Dept' ];

interface IssueDetailDrawerProps {
  issue: DetailedReport | null;
  onClose: () => void;
  onAssign: (issueId: number, assignee: string) => void;
  onStatusChange: (issueId: number, status: ReportStatus) => void;
}

const IssueDetailDrawer: React.FC<IssueDetailDrawerProps> = ({ issue, onClose, onAssign, onStatusChange }) => {
    const { showToast } = useNotifications();
    const [assignee, setAssignee] = useState('Unassigned');
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);

    useEffect(() => {
        if (issue) {
            setAssignee(issue.assigned_to?.name || 'Unassigned');
            
            setIsSuggestionLoading(true);
            setAiSuggestion(null);
            const timer = setTimeout(() => { // Simulate network delay for AI
                mockApi.getAiSuggestion(issue).then(suggestion => {
                    setAiSuggestion(suggestion);
                    setIsSuggestionLoading(false);
                });
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [issue]);

    const getTimelineStepProps = (message: string, isCurrent: boolean) => {
        const lowerMessage = message.toLowerCase();
        
        let IconComponent = InfoIcon;
        let iconBgColor = isCurrent ? 'bg-gray-500' : 'bg-gray-100';
        let iconColor = isCurrent ? 'text-white' : 'text-gray-600';

        if (lowerMessage.includes('received')) {
            IconComponent = DocumentTextIcon;
            iconBgColor = isCurrent ? 'bg-blue-500' : 'bg-blue-100';
            iconColor = isCurrent ? 'text-white' : 'text-blue-600';
        } else if (lowerMessage.includes('review')) {
            IconComponent = MagnifyingGlassIcon;
            iconBgColor = isCurrent ? 'bg-yellow-500' : 'bg-yellow-100';
            iconColor = isCurrent ? 'text-white' : 'text-yellow-600';
        } else if (lowerMessage.includes('assigned')) {
            IconComponent = UserCircleIcon;
            iconBgColor = isCurrent ? 'bg-purple-500' : 'bg-purple-100';
            iconColor = isCurrent ? 'text-white' : 'text-purple-600';
        } else if (lowerMessage.includes('resolved')) {
            IconComponent = CheckCircleIcon;
            iconBgColor = isCurrent ? 'bg-green-500' : 'bg-green-100';
            iconColor = isCurrent ? 'text-white' : 'text-green-600';
        }

        return { IconComponent, iconBgColor, iconColor };
    };

    if (!issue) return null;

    const handleAssign = () => {
        if (assignee === 'Unassigned') {
            showToast('Please select an officer or department to assign.');
            return;
        }
        onAssign(issue.id, assignee);
    };
    
    const handleResolve = () => {
        onStatusChange(issue.id, ReportStatus.Resolved);
        onClose();
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 ${issue ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-gray-50 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${issue ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div key={issue.id} className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-800">Issue #{issue.id}</h2>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {issue.photo && (
                            <div className="animate-fadeInUp animation-delay-100">
                                <img src={issue.photo} alt={issue.title} className="w-full h-auto object-cover rounded-xl" />
                            </div>
                        )}
                        
                        <div className="animate-fadeInUp animation-delay-150">
                            <h3 className="font-bold text-lg text-gray-800">{issue.title}</h3>
                            <p className="text-sm text-gray-500">{issue.category}</p>
                        </div>

                        {/* AI Suggestion Section */}
                        <div className="bg-teal-50 border-2 border-teal-200/50 rounded-xl p-4 animate-fadeInUp animation-delay-200">
                            <h4 className="font-bold text-teal-900 flex items-center mb-2"><AiAssistantIcon className="w-5 h-5 mr-2"/>AI Suggestion</h4>
                            {isSuggestionLoading ? (
                                <div className="flex items-center space-x-2 text-sm text-teal-800/80">
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                    <span>Analyzing issue...</span>
                                </div>
                            ) : (
                                <p className="text-sm text-teal-800/90">{aiSuggestion}</p>
                            )}
                        </div>

                        <div className="animate-fadeInUp animation-delay-250">
                            <h4 className="font-semibold text-sm text-gray-700 mb-1">Description</h4>
                            <p className="text-sm text-gray-600">{issue.description}</p>
                        </div>
                         <div className="animate-fadeInUp animation-delay-300">
                            <h4 className="font-semibold text-sm text-gray-700 mb-1">Location</h4>
                            <p className="text-sm text-gray-600">{issue.location}</p>
                        </div>

                         <div className="grid grid-cols-3 gap-4 text-sm animate-fadeInUp animation-delay-350">
                            <div>
                                <h4 className="font-semibold text-gray-700">Status</h4>
                                <p>{issue.status}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">Priority</h4>
                                <p>{issue.priority || 'N/A'}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-700">SLA Deadline</h4>
                                <p>{issue.sla_deadline ? new Date(issue.sla_deadline).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>

                        <div className="animate-fadeInUp animation-delay-400">
                             <h4 className="font-semibold text-sm text-gray-700 mb-2">Assign Officer/Department</h4>
                             <div className="flex items-center space-x-2">
                                <select value={assignee} onChange={e => setAssignee(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                                    {mockOfficers.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <button onClick={handleAssign} className="px-4 py-2 text-white font-semibold rounded-md bg-green-600 hover:bg-green-700">Assign</button>
                             </div>
                        </div>

                        <div className="animate-fadeInUp animation-delay-450">
                             <h3 className="font-semibold text-sm text-gray-700 mb-4">Update History</h3>
                             <div className="space-y-0">
                                 {issue.updates.map((update, index) => {
                                     const isLast = index === issue.updates.length - 1;
                                     const isCurrent = index === issue.updates.length - 1;
                                     const { IconComponent, iconBgColor, iconColor } = getTimelineStepProps(update.message, isCurrent);

                                     return (
                                         <div key={index} className="flex">
                                             <div className="flex flex-col items-center mr-4">
                                                 <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBgColor} ${iconColor}`}>
                                                     <IconComponent />
                                                 </div>
                                                 {!isLast && <div className="w-0.5 grow bg-gray-300"></div>}
                                             </div>
                                             <div className="pb-6 pt-1">
                                                 <p className={`font-semibold ${isCurrent ? 'text-gray-800' : 'text-gray-600'}`}>{update.message}</p>
                                                 <p className="text-xs text-gray-500">{update.by} - {new Date(update.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                             </div>
                                         </div>
                                     );
                                 })}
                             </div>
                        </div>

                        <div className="animate-fadeInUp animation-delay-500">
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Internal Notes</h4>
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <textarea 
                                    placeholder="Add an internal note for your team..."
                                    rows={3}
                                    className="w-full text-sm p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                                <button 
                                    onClick={() => showToast('Note added to timeline!')}
                                    className="w-full mt-2 px-4 py-2 text-sm text-white font-semibold rounded-md bg-slate-600 hover:bg-slate-700"
                                >
                                    Add Note
                                </button>
                            </div>
                        </div>

                    </div>
                    
                     {/* Actions Footer */}
                    <div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center space-x-2 flex-shrink-0 animate-fadeInUp animation-delay-550">
                        <button onClick={handleResolve} className="flex-1 py-2.5 px-4 text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700" disabled={issue.status === ReportStatus.Resolved}>Mark as Resolved</button>
                        <button onClick={() => showToast('Issue Escalated!')} className="flex-1 py-2.5 px-4 text-white font-semibold rounded-xl bg-orange-500 hover:bg-orange-600">Escalate</button>
                    </div>

                </div>
            </div>
        </>
    );
};
export default IssueDetailDrawer;