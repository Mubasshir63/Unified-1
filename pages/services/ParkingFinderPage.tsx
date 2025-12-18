import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { ParkingIcon } from '../../components/icons/NavIcons';

interface ParkingFinderPageProps {
  onBack: () => void;
}

const parkingLots = [
  { name: 'Central Mall Parking', distance: '0.5 km', available: 25, total: 100 },
  { name: 'City Center Lot A', distance: '1.2 km', available: 5, total: 50 },
  { name: 'Railway Station Parking', distance: '2.8 km', available: 80, total: 200 },
];

const ParkingLotCard: React.FC<{ lot: typeof parkingLots[0] }> = ({ lot }) => {
    const availability = (lot.available / lot.total) * 100;
    const color = availability > 50 ? 'text-green-600' : availability > 20 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-gray-800">{lot.name}</h3>
                <p className="text-sm text-gray-500">{lot.distance}</p>
            </div>
            <div className="text-right">
                <p className={`font-bold text-lg ${color}`}>{lot.available}</p>
                <p className="text-xs text-gray-500">slots available</p>
            </div>
        </div>
    );
};

const ParkingFinderPage: React.FC<ParkingFinderPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout title={t('parkingFinder')} subtitle={t('parkingFinderDesc')} onBack={onBack}>
            <div className="space-y-3">
                {parkingLots.map(lot => <ParkingLotCard key={lot.name} lot={lot} />)}
            </div>
        </ServicePageLayout>
    );
};

export default ParkingFinderPage;
