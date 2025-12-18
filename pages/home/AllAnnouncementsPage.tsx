

import React from 'react';
// FIX: The mock data is exported from mockApi.ts, not the empty homeData.ts file.
import { mockAnnouncements } from '../../api/mockApi';
import { Announcement, ReportStatus } from '../../types';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';

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

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-3 transition-shadow duration-300 hover:shadow-md hover:border-green-300">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-md leading-tight flex-1 pr-2">{announcement.title}</h3>
                    <StatusBadge status={announcement.status} />
                </div>
                <p className="text-gray-600 text-sm mb-3">{announcement.content}</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                 <p className="text-xs text-gray-500 font-medium">{announcement.source}</p>
                 <p className="text-xs text-gray-500">{announcement.timestamp}</p>
            </div>
        </div>
    );
};


const AllAnnouncementsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout
            title={t('govtAnnouncements')}
            subtitle="All recent official announcements"
            onBack={onBack}
        >
            <div className="space-y-3">
                {mockAnnouncements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
            </div>
        </ServicePageLayout>
    );
};

export default AllAnnouncementsPage;