import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotifications } from '../../contexts/NotificationsContext';
import ServicePageLayout from './ServicePageLayout';

interface VolunteerPageProps {
  onBack: () => void;
}

const opportunities = [
    { 
        titleKey: 'treePlantation', 
        date: 'Dec 25, 2024', 
        duration: '9 AM - 1 PM', 
        desc: 'Join us in planting 500 new saplings at the city park to improve our green cover.', 
        image: 'https://picsum.photos/seed/planting/800/400' 
    },
    { 
        titleKey: 'communityCleaning', 
        date: 'Jan 1, 2025', 
        duration: '8 AM - 11 AM', 
        desc: 'A cleanliness drive to beautify our neighborhood streets and public spaces.', 
        image: 'https://picsum.photos/seed/cleaning/800/400' 
    },
    { 
        titleKey: 'helpAtShelter', 
        date: 'Every Weekend', 
        duration: 'Flexible Hours', 
        desc: 'Spend time with animals, assist with feeding, and help maintain the local animal shelter.', 
        image: 'https://picsum.photos/seed/animals/800/400' 
    },
];

const OpportunityCard: React.FC<{ opportunity: typeof opportunities[0], onSignUp: () => void }> = ({ opportunity, onSignUp }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <img src={opportunity.image} alt={t(opportunity.titleKey as any)} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-xl text-gray-900">{t(opportunity.titleKey as any)}</h3>
                <div className="flex items-center text-xs text-gray-500 my-2">
                    <span>{opportunity.date}</span>
                    <span className="mx-2">&bull;</span>
                    <span>{opportunity.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{opportunity.desc}</p>
                <button 
                    onClick={onSignUp}
                    className="w-full py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-sm">
                    {t('signUpNow')}
                </button>
            </div>
        </div>
    );
};

const VolunteerPage: React.FC<VolunteerPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();

    const handleSignUp = (titleKey: string) => {
        showToast(`Thank you for signing up for "${t(titleKey as any)}"!`);
    };

    return (
        <ServicePageLayout
            title={t('volunteer')}
            subtitle={t('volunteerDesc')}
            onBack={onBack}
        >
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('upcomingDrives')}</h2>
                <div className="space-y-4">
                    {opportunities.map(op => (
                        <OpportunityCard key={op.titleKey} opportunity={op} onSignUp={() => handleSignUp(op.titleKey)} />
                    ))}
                </div>
            </div>
        </ServicePageLayout>
    );
};

export default VolunteerPage;