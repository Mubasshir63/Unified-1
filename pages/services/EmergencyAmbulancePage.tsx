import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { AmbulanceIcon } from '../../components/icons/NavIcons';

interface EmergencyAmbulancePageProps {
  onBack: () => void;
}

const EmergencyAmbulancePage: React.FC<EmergencyAmbulancePageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    
    const handleCall = () => {
        showToast('Calling 108 for an emergency ambulance...');
    };

    return (
        <ServicePageLayout title={t('emergencyAmbulance')} subtitle={t('emergencyAmbulanceDesc')} onBack={onBack}>
            <div className="flex flex-col items-center justify-center h-full text-center">
                <button 
                    onClick={handleCall}
                    className="w-48 h-48 bg-red-100 rounded-full flex flex-col items-center justify-center animate-pulse-sos border-4 border-red-200"
                >
                    <AmbulanceIcon />
                    <span className="mt-2 font-bold text-red-700 text-lg">CALL 108</span>
                </button>
                <p className="mt-6 text-gray-600 max-w-xs">In case of a medical emergency, press the button above to call for an ambulance immediately.</p>
            </div>
        </ServicePageLayout>
    );
};

export default EmergencyAmbulancePage;
