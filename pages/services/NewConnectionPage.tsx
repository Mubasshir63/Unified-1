import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { NewConnectionIcon } from '../../components/icons/NavIcons';

interface NewConnectionPageProps {
  onBack: () => void;
}

const NewConnectionPage: React.FC<NewConnectionPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [connectionType, setConnectionType] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast(`Application for new ${connectionType} connection submitted.`);
    };

    return (
        <ServicePageLayout title={t('newConnection')} subtitle={t('newConnectionDesc')} onBack={onBack}>
             <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-xl border border-gray-200">
                 <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <NewConnectionIcon />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Application Form</h2>
                </div>
                <select value={connectionType} onChange={e => setConnectionType(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl">
                    <option value="">-- Select Connection Type --</option>
                    <option value="water">Water Supply</option>
                    <option value="electricity">Electricity</option>
                    <option value="gas">Piped Gas</option>
                </select>
                <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                <input type="text" placeholder="Full Address" required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700">Submit Application</button>
            </form>
        </ServicePageLayout>
    );
};

export default NewConnectionPage;
