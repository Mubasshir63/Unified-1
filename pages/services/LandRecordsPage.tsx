import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { DocumentTextIcon } from '../../components/icons/NavIcons';

interface LandRecordsPageProps {
  onBack: () => void;
}

const LandRecordsPage: React.FC<LandRecordsPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [recordId, setRecordId] = useState('');
    
    const handleFetch = (e: React.FormEvent) => {
        e.preventDefault();
        showToast(`Fetching land record: ${recordId}`);
    };

    return (
        <ServicePageLayout title={t('landRecords')} subtitle={t('landRecordsDesc')} onBack={onBack}>
             <div className="bg-white p-5 rounded-2xl border border-gray-200">
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <DocumentTextIcon />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Search Land Records</h2>
                </div>
                <form onSubmit={handleFetch} className="space-y-4">
                    <input type="text" placeholder="Enter Survey/Record Number" value={recordId} onChange={e => setRecordId(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                    <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700">Fetch Record</button>
                </form>
            </div>
        </ServicePageLayout>
    );
};

export default LandRecordsPage;
