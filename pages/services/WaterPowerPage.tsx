import React, { useContext } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { PayBillsIcon, NewConnectionIcon, ComplaintIcon, MyReportsIcon, UserCircleIcon } from '../../components/icons/NavIcons';
import { useNotifications } from '../../contexts/NotificationsContext';
import { UserContext } from '../../contexts/UserContext';

interface WaterPowerPageProps {
  onBack: () => void;
  onCreateIssue: (issueData: {
      title: string;
      category: string;
      description: string;
      coords: { lat: number; lng: number };
      priority: 'High';
  }) => void;
}

const ActionCard: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="relative group bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm border border-gray-200 aspect-square overflow-hidden transform hover:-translate-y-1 transition-all duration-300 tilt-card-deep">
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-3 text-teal-600">{icon}</div>
            <h3 className="font-semibold text-gray-800">{label}</h3>
        </div>
    </button>
);


const WaterPowerPage: React.FC<WaterPowerPageProps> = ({ onBack, onCreateIssue }) => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { showToast } = useNotifications();
    
    const handleReportOutage = () => {
        if (!user) return;
        onCreateIssue({
            title: 'Power/Water Outage Report',
            category: 'Utilities',
            description: 'User reported a power or water outage from the Water & Power service page.',
            coords: user.location.coords,
            priority: 'High',
        });
        onBack();
    };
    
    const actions = [
        { icon: <PayBillsIcon className="w-8 h-8" />, label: t('payElectricityBill'), onClick: () => showToast('Navigating to electricity bill payment...') },
        { icon: <PayBillsIcon className="w-8 h-8" />, label: t('payWaterBill'), onClick: () => showToast('Navigating to water bill payment...') },
        { icon: <NewConnectionIcon className="w-8 h-8" />, label: t('applyNewConnection'), onClick: () => showToast('Opening new connection form...') },
        { icon: <ComplaintIcon className="w-8 h-8" />, label: t('reportOutage'), onClick: handleReportOutage },
        { icon: <MyReportsIcon className="w-8 h-8" />, label: t('viewConsumption'), onClick: () => showToast('Showing consumption history...') },
        { icon: <UserCircleIcon className="w-8 h-8" />, label: t('updateContact'), onClick: () => showToast('Opening contact details page...') },
    ];

    return (
        <ServicePageLayout
            title={t('waterPower')}
            subtitle={t('waterPowerDesc')}
            onBack={onBack}
        >
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, i) => (
                    <div key={action.label} className="animate-fadeInUp" style={{animationDelay: `${i*50}ms`}}>
                        <ActionCard {...action} />
                    </div>
                ))}
            </div>
        </ServicePageLayout>
    );
};

export default WaterPowerPage;