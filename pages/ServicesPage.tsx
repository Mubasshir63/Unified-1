import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Page } from '../types';
import {
    NewReportIcon, MedicalHelpIcon, WaterPowerIcon, TransportIcon, ComplaintIcon, GovtPortalsIcon, DownloadIcon,
    DocumentTextIcon, UserCircleIcon, BloodBankIcon, HeartIcon, AmbulanceIcon, PayBillsIcon, ParkingIcon,
    WasteTrackerIcon, NewConnectionIcon, LocalEventsIcon, VolunteerIcon, HomeIcon,
    SchemeIcon, LegalHelpIcon, KeyIcon, ShieldCheckIcon, PregnantWomanIcon
} from '../components/icons/NavIcons';

// High-fidelity service data with matching images
const services = [
    // Featured
    { key: 'fileNewReport', nameKey: 'fileNewReport', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=400', featured: true, icon: <NewReportIcon /> },
    { key: 'medicalHelp', nameKey: 'medicalHelp', categoryKey: 'medical', image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=400', featured: true, icon: <MedicalHelpIcon /> },
    { key: 'momsCare', nameKey: "momsCare", categoryKey: 'medical', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65ee9?auto=format&fit=crop&q=80&w=400', featured: true, icon: <PregnantWomanIcon /> },
    { key: 'waterPower', nameKey: 'waterPower', categoryKey: 'utilities', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400', featured: true, icon: <WaterPowerIcon /> },
    
    // Govt
    { key: 'cyberSafety', nameKey: 'cyberSafety', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400', icon: <ShieldCheckIcon /> },
    { key: 'govtSchemes', nameKey: 'govtSchemes', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=400', icon: <SchemeIcon /> },
    { key: 'legalHelp', nameKey: 'legalHelp', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400', icon: <LegalHelpIcon /> },
    { key: 'complaintRegistration', nameKey: 'complaintRegistration', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400', icon: <ComplaintIcon /> },
    { key: 'govtPortals', nameKey: 'govtPortals', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400', icon: <GovtPortalsIcon /> },
    { key: 'downloadCenter', nameKey: 'downloadCenter', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400', icon: <DownloadIcon /> },
    { key: 'aadhaarServices', nameKey: 'aadhaarServices', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=400', icon: <UserCircleIcon /> },
    { key: 'passportSeva', nameKey: 'passportSeva', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=400', icon: <DocumentTextIcon /> },
    { key: 'digitalLocker', nameKey: 'digitalLocker', categoryKey: 'govt', image: 'https://images.unsplash.com/photo-1633265485768-30698f1d113f?auto=format&fit=crop&q=80&w=400', icon: <KeyIcon /> },
    
    // Medical
    { key: 'findBloodBanks', nameKey: 'findBloodBanks', categoryKey: 'medical', image: 'https://images.unsplash.com/photo-1615461066841-6116ecaaba74?auto=format&fit=crop&q=80&w=400', icon: <BloodBankIcon /> },
    { key: 'bookVaccination', nameKey: 'bookVaccination', categoryKey: 'medical', image: 'https://images.unsplash.com/photo-1618961734760-466979ec35b0?auto=format&fit=crop&q=80&w=400', icon: <HeartIcon /> },
    { key: 'emergencyAmbulance', nameKey: 'emergencyAmbulance', categoryKey: 'medical', image: 'https://images.unsplash.com/photo-1587350859727-41846b01f9cc?auto=format&fit=crop&q=80&w=400', icon: <AmbulanceIcon /> },
      
    // Transport
    { key: 'transportInfo', nameKey: 'transportInfo', categoryKey: 'transport', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400', icon: <TransportIcon /> },
    { key: 'metroCardRecharge', nameKey: 'metroCardRecharge', categoryKey: 'transport', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400', icon: <PayBillsIcon /> },
    { key: 'parkingFinder', nameKey: 'parkingFinder', categoryKey: 'transport', image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400', icon: <ParkingIcon /> },
    
    // Utilities
    { key: 'wasteTracker', nameKey: 'wasteTracker', categoryKey: 'utilities', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400', icon: <WasteTrackerIcon /> },
    { key: 'newConnection', nameKey: 'newConnection', categoryKey: 'utilities', image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400', icon: <NewConnectionIcon /> },
    
    // Community
    { key: 'localEvents', nameKey: 'localEvents', categoryKey: 'community', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400', icon: <LocalEventsIcon /> },
    { key: 'volunteer', nameKey: 'volunteer', categoryKey: 'community', image: 'https://images.unsplash.com/photo-1559027615-cd169c5a242c?auto=format&fit=crop&q=80&w=400', icon: <VolunteerIcon /> },
    { key: 'communityCenters', nameKey: 'communityCenters', categoryKey: 'community', image: 'https://images.unsplash.com/photo-1524813685485-3de527c4f4c9?auto=format&fit=crop&q=80&w=400', icon: <HomeIcon isActive /> },

    // Housing
    { key: 'propertyTax', nameKey: 'propertyTax', categoryKey: 'housing', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400', icon: <PayBillsIcon /> },
    { key: 'landRecords', nameKey: 'landRecords', categoryKey: 'housing', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400', icon: <DocumentTextIcon /> },

    // Education
    { key: 'schoolAdmissions', nameKey: 'schoolAdmissions', categoryKey: 'education', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400', icon: <GovtPortalsIcon /> },
    { key: 'publicLibraries', nameKey: 'publicLibraries', categoryKey: 'education', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400', icon: <GovtPortalsIcon /> },
];

const categories = [
    { key: 'govt', nameKey: 'govt' },
    { key: 'medical', nameKey: 'medical' },
    { key: 'transport', nameKey: 'transport' },
    { key: 'utilities', nameKey: 'utilities' },
    { key: 'community', nameKey: 'community' },
    { key: 'housing', nameKey: 'housing' },
    { key: 'education', nameKey: 'education' },
];

interface ServicesPageProps {
  onSelectService: (serviceKey: string) => void;
  setCurrentPage: (page: Page) => void;
  searchQuery: string;
}

const CategoryChip: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-5 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 border transform hover:scale-105 ${isActive ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-teal-500'}`}>
        {label}
    </button>
);

const ServiceImageCard: React.FC<{ service: typeof services[0]; onClick: () => void; t: (key: any) => string; }> = ({ service, onClick, t }) => (
    <button onClick={onClick} className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden group shadow-lg transform hover:-translate-y-1 transition-all duration-300">
        <img src={service.image} alt={t(service.nameKey as any)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-xl p-2 border border-white/30 text-white shadow-xl">
            {React.cloneElement(service.icon as React.ReactElement, { className: "w-5 h-5" })}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-left">
            <h3 className="font-black text-white text-sm leading-tight uppercase tracking-tight drop-shadow-md">{t(service.nameKey as any)}</h3>
            <p className="text-[9px] text-teal-400 font-black uppercase tracking-widest mt-1">Official Portal</p>
        </div>
    </button>
);

const ServicesPage: React.FC<ServicesPageProps> = ({ onSelectService, setCurrentPage, searchQuery }) => {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');

    const handleCardClick = (serviceKey: string) => {
        if (serviceKey === 'fileNewReport') {
            setCurrentPage(Page.Report);
        } else {
            onSelectService(serviceKey);
        }
    };
    
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filteredServices = useMemo(() => services.filter(service => {
        const name = t(service.nameKey as any);
        const matchesSearch = !searchQuery || name.toLowerCase().includes(lowerCaseQuery);
        return matchesSearch;
    }), [searchQuery, t, lowerCaseQuery]);

    const serviceCategories = useMemo(() => categories.map(cat => ({
        ...cat,
        services: filteredServices.filter(s => s.categoryKey === cat.key)
    })).filter(cat => cat.services.length > 0), [filteredServices]);

    const displayCategories = activeCategory === 'all' ? serviceCategories : serviceCategories.filter(c => c.key === activeCategory);

    return (
        <div className="bg-slate-50 text-gray-800 min-h-full pb-24">
            <div className="p-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 border-b border-gray-200/50">
                <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
                     <button onClick={() => setActiveCategory('all')} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 border transform hover:scale-105 ${activeCategory === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-teal-500'}`}>
                        {t('all')}
                    </button>
                    {categories.map(cat => (
                        <CategoryChip 
                            key={cat.key} 
                            label={t(cat.nameKey as any)} 
                            isActive={activeCategory === cat.key} 
                            onClick={() => setActiveCategory(cat.key)}
                        />
                    ))}
                </div>
            </div>

            <div className="p-4 pt-6">
                {filteredServices.length === 0 && searchQuery ? (
                     <div className="text-center py-20 text-gray-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">{t('noResultsFound')}</h2>
                        <p className="text-sm px-10">{t('noResultsMatch', { query: searchQuery })}</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {displayCategories.map(category => (
                             <section key={category.key} className="space-y-5">
                                <h2 className="text-xl font-black text-slate-900 px-1 tracking-tight flex items-center">
                                    <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3"></span>
                                    {t(category.nameKey as any)} Services
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {category.services.map(service => (
                                        <ServiceImageCard key={service.key} service={service} onClick={() => handleCardClick(service.key)} t={t} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;