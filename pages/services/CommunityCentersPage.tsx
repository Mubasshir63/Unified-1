import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { HomeIcon } from '../../components/icons/NavIcons';

interface CommunityCentersPageProps {
  onBack: () => void;
}

const centers = [
  { name: 'Sector 12 Community Hall', capacity: 200, price: '₹5000 / day' },
  { name: 'Green Valley Community Center', capacity: 150, price: '₹3500 / day' },
  { name: 'Unity Hall', capacity: 300, price: '₹8000 / day' },
];

const CenterCard: React.FC<{ center: typeof centers[0] }> = ({ center }) => {
    const { showToast } = useNotifications();
    const handleBook = () => showToast(`Opening booking for ${center.name}`);
    
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800">{center.name}</h3>
            <div className="text-sm text-gray-500 my-2">
                <span>Capacity: {center.capacity}</span>
                <span className="mx-2">&bull;</span>
                <span>{center.price}</span>
            </div>
            <button onClick={handleBook} className="w-full mt-2 py-2 px-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Book Now</button>
        </div>
    );
};


const CommunityCentersPage: React.FC<CommunityCentersPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout title={t('communityCenters')} subtitle={t('communityCentersDesc')} onBack={onBack}>
            <div className="space-y-3">
                {centers.map(center => <CenterCard key={center.name} center={center} />)}
            </div>
        </ServicePageLayout>
    );
};

export default CommunityCentersPage;
