import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { HospitalIcon } from '../../components/icons/NavIcons';
import { useNotifications } from '../../contexts/NotificationsContext';

interface MedicalHelpPageProps {
  onBack: () => void;
}

type FacilityType = 'Hospitals' | 'Clinics' | 'Pharmacies' | 'Blood Bank';

const facilities = [
  { name: 'City General Hospital', type: 'Hospitals', distance: '1.2 km', phone: '123-456-7890' },
  { name: 'Sunshine Clinic', type: 'Clinics', distance: '0.8 km', phone: '123-456-7891' },
  { name: 'Wellness Pharmacy', type: 'Pharmacies', distance: '0.5 km', phone: '123-456-7892' },
  { name: 'Apollo Hospital', type: 'Hospitals', distance: '3.5 km', phone: '123-456-7893' },
  { name: 'Community Care Clinic', type: 'Clinics', distance: '2.1 km', phone: '123-456-7894' },
];

const FilterChip: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${isActive ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'}`}
    >
        {label}
    </button>
);

const FacilityCard: React.FC<{ facility: typeof facilities[0] }> = ({ facility }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();

    const handleCall = () => {
        showToast(`Calling ${facility.name} at ${facility.phone}`);
    };

    const handleDirections = () => {
        showToast(`Getting directions to ${facility.name}`);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-800">{facility.name}</h3>
                    <p className="text-sm text-gray-500">{facility.type} &bull; {facility.distance}</p>
                </div>
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <HospitalIcon />
                </div>
            </div>
            <div className="flex space-x-2">
                <button onClick={handleCall} className="flex-1 py-2 px-3 text-sm text-center font-semibold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">{t('callNow')}</button>
                <button onClick={handleDirections} className="flex-1 py-2 px-3 text-sm text-center font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">{t('getDirections')}</button>
            </div>
        </div>
    );
};


const MedicalHelpPage: React.FC<MedicalHelpPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState<FacilityType | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFacilities = facilities.filter(f => {
        const matchesFilter = activeFilter === 'All' || f.type === activeFilter;
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <ServicePageLayout
            title={t('medicalHelp')}
            subtitle={t('medicalHelpDesc')}
            onBack={onBack}
        >
            <div className="space-y-4">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder={t('searchFacilities')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>

                <div className="flex space-x-2 overflow-x-auto pb-2">
                    <FilterChip label="All" isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
                    <FilterChip label={t('hospitals')} isActive={activeFilter === 'Hospitals'} onClick={() => setActiveFilter('Hospitals')} />
                    <FilterChip label={t('clinics')} isActive={activeFilter === 'Clinics'} onClick={() => setActiveFilter('Clinics')} />
                    <FilterChip label={t('pharmacies')} isActive={activeFilter === 'Pharmacies'} onClick={() => setActiveFilter('Pharmacies')} />
                </div>
                
                <div className="space-y-3 pt-2">
                    {filteredFacilities.map(facility => (
                        <FacilityCard key={facility.name} facility={facility} />
                    ))}
                </div>
            </div>
        </ServicePageLayout>
    );
};

export default MedicalHelpPage;