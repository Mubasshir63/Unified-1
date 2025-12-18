import React, { useContext } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { WasteTrackerIcon, StreetlightIcon, WaterLeakIcon } from '../../components/icons/NavIcons';
import { UserContext } from '../../contexts/UserContext';

interface WasteTrackerPageProps {
    onBack: () => void;
    onCreateIssue: (issueData: {
        title: string;
        category: string;
        description: string;
        coords: { lat: number; lng: number };
        priority: 'Medium';
    }) => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm tilt-card">
        <div className="flex items-center mb-3">
            {icon && <div className="mr-3 text-teal-600">{icon}</div>}
            <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

const Guideline: React.FC<{ icon: React.ReactNode, title: string, items: string[] }> = ({ icon, title, items }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <ul className="list-disc list-inside text-sm text-gray-500">
                {items.map(item => <li key={item}>{item}</li>)}
            </ul>
        </div>
    </div>
);


const WasteTrackerPage: React.FC<{ onBack: () => void; onCreateIssue: any }> = ({ onBack, onCreateIssue }) => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);

    const handleReportMiss = () => {
         if (!user) return;
        onCreateIssue({
            title: 'Missed Waste Collection',
            category: 'Sanitation',
            description: `User reported a missed garbage collection at their location on ${new Date().toLocaleDateString()}.`,
            coords: user.location.coords,
            priority: 'Medium',
        });
        onBack();
    };

    return (
        <ServicePageLayout
            title={t('wasteTracker')}
            subtitle={t('wasteTrackerDesc')}
            onBack={onBack}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard title={t('nextCollection')}>
                        <p className="text-3xl font-bold text-teal-600">{t('tueFri')}</p>
                        <p className="text-sm text-gray-500">Between 8 AM - 12 PM</p>
                    </InfoCard>
                    <InfoCard title={t('collectionStatus')}>
                        <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="font-semibold text-gray-700">{t('onRoute')}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Last updated: 5 mins ago</p>
                    </InfoCard>
                </div>

                <button 
                    onClick={handleReportMiss}
                    className="w-full py-3 px-4 text-red-600 font-semibold rounded-xl bg-red-100 hover:bg-red-200 transition-colors shadow-sm">
                    {t('reportMissed')}
                </button>

                <InfoCard title={t('recyclingGuidelines')}>
                    <div className="space-y-4">
                        <Guideline icon={<WasteTrackerIcon />} title={t('wetWaste')} items={['Food scraps', 'Vegetable peels', 'Garden waste']} />
                        <Guideline icon={<StreetlightIcon />} title={t('dryWaste')} items={['Plastic bottles', 'Paper', 'Cardboard', 'Glass']} />
                        <Guideline icon={<WaterLeakIcon />} title={t('eWaste')} items={['Old chargers', 'Batteries', 'Non-working electronics']} />
                    </div>
                </InfoCard>
            </div>
        </ServicePageLayout>
    );
};

export default WasteTrackerPage;