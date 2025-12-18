import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { BloodBankIcon } from '../../components/icons/NavIcons';

interface FindBloodBanksPageProps {
  onBack: () => void;
}

const bloodBanks = [
  { name: 'Red Cross Blood Bank', distance: '2.5 km', phone: '123-456-7890' },
  { name: 'City Central Blood Bank', distance: '4.1 km', phone: '987-654-3210' },
  { name: 'Lions Club Blood Center', distance: '5.8 km', phone: '555-123-4567' },
];

const BloodBankCard: React.FC<{ bank: typeof bloodBanks[0] }> = ({ bank }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();

    const handleCall = () => showToast(`Calling ${bank.name}`);
    const handleDirections = () => showToast(`Getting directions to ${bank.name}`);

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800">{bank.name}</h3>
                    <p className="text-sm text-gray-500">{bank.distance}</p>
                </div>
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <BloodBankIcon />
                </div>
            </div>
            <div className="flex space-x-2">
                <button onClick={handleCall} className="flex-1 py-2 px-3 text-sm text-center font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">{t('callNow')}</button>
                <button onClick={handleDirections} className="flex-1 py-2 px-3 text-sm text-center font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">{t('getDirections')}</button>
            </div>
        </div>
    );
};

const FindBloodBanksPage: React.FC<FindBloodBanksPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    
    return (
        <ServicePageLayout title={t('findBloodBanks')} subtitle={t('findBloodBanksDesc')} onBack={onBack}>
            <div className="space-y-3">
                {bloodBanks.map(bank => <BloodBankCard key={bank.name} bank={bank} />)}
            </div>
        </ServicePageLayout>
    );
};

export default FindBloodBanksPage;
