



import React, { useState } from 'react';
import { Announcement, ReportStatus } from '../../../types';

interface CommunicationsViewProps {
    announcements: Announcement[];
    onCreate: (newAnnouncement: Omit<Announcement, 'id' | 'timestamp'>) => void;
    isLoading: boolean;
}

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-md leading-tight flex-1 pr-2">{announcement.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800`}>
                    {announcement.status}
                </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                 <p className="text-xs text-gray-500 font-medium">{announcement.source}</p>
                 <p className="text-xs text-gray-500">{announcement.timestamp}</p>
            </div>
        </div>
    );
};

const FormSkeleton: React.FC = () => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-shimmer">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
            <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded-md"></div>
            </div>
             <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-24 bg-gray-200 rounded-md"></div>
            </div>
            <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-11 bg-gray-200 rounded-lg mt-2"></div>
        </div>
    </div>
);
const AnnouncementCardSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 animate-shimmer">
        <div className="flex justify-between items-start mb-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-full mt-3"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6 mt-2"></div>
        <div className="flex justify-between items-center pt-3 mt-3 border-t">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const CommunicationsView: React.FC<CommunicationsViewProps> = ({ announcements, onCreate, isLoading }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [source, setSource] = useState('Municipal Corporation');
    const [status, setStatus] = useState<ReportStatus>(ReportStatus.UnderReview);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || !source) return;
        setIsSubmitting(true);
        await onCreate({ title, content, source, status });
        setTitle('');
        setContent('');
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
             <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-fadeInUp">
                <div className="lg:col-span-1">
                    <FormSkeleton />
                </div>
                <div className="lg:col-span-2">
                     <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-shimmer"></div>
                     <div className="space-y-4">
                        <AnnouncementCardSkeleton />
                        <AnnouncementCardSkeleton />
                        <AnnouncementCardSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-fadeInUp">
            <div className="lg:col-span-1">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Announcement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="content" className="text-sm font-medium text-gray-700 block mb-1">Content</label>
                            <textarea id="content" rows={4} value={content} onChange={e => setContent(e.target.value)} required className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="source" className="text-sm font-medium text-gray-700 block mb-1">Source Department</label>
                            <input id="source" type="text" value={source} onChange={e => setSource(e.target.value)} required className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="status" className="text-sm font-medium text-gray-700 block mb-1">Status / Category</label>
                             <select id="status" value={status} onChange={e => setStatus(e.target.value as ReportStatus)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                                <option value={ReportStatus.UnderReview}>Informational</option>
                                <option value={ReportStatus.Emergency}>Emergency</option>
                            </select>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-2.5 px-4 text-white font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50">
                            {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
                        </button>
                    </form>
                </div>
            </div>
            <div className="lg:col-span-2 h-full">
                 <h2 className="text-xl font-bold text-gray-800 mb-4">Published Announcements</h2>
                 <div className="space-y-4">
                     {announcements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
                </div>
            </div>
        </div>
    );
};

export default CommunicationsView;
