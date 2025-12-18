
import React, { useState, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Page } from '../types';
import {
    NewReportIcon, MedicalHelpIcon, WaterPowerIcon, TransportIcon, ComplaintIcon, GovtPortalsIcon, DownloadIcon,
    DocumentTextIcon, UserCircleIcon, BloodBankIcon, HeartIcon, AmbulanceIcon, PayBillsIcon, ParkingIcon,
    WasteTrackerIcon, NewConnectionIcon, LocalEventsIcon, VolunteerIcon, HomeIcon,
    SchemeIcon, LegalHelpIcon, KeyIcon, ShieldCheckIcon, BabyIcon, PregnantWomanIcon
} from '../components/icons/NavIcons';

// Expanded service data with relevant, high-quality images and icons
const services = [
    // Featured
    { key: 'fileNewReport', nameKey: 'fileNewReport', descriptionKey: 'reportProblemDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/report/600/800', featured: true, icon: <NewReportIcon /> },
    { key: 'medicalHelp', nameKey: 'medicalHelp', descriptionKey: 'medicalHelpDesc', categoryKey: 'medical', image: 'https://picsum.photos/seed/doctor/600/800', featured: true, icon: <MedicalHelpIcon /> },
    { key: 'momsCare', nameKey: "Mom's Care", descriptionKey: 'Pregnancy support & breastfeeding centers', categoryKey: 'medical', image: 'https://picsum.photos/seed/motherbaby/600/800', featured: true, icon: <PregnantWomanIcon className="w-8 h-8" /> },
    { key: 'waterPower', nameKey: 'waterPower', descriptionKey: 'waterPowerDesc', categoryKey: 'utilities', image: 'https://picsum.photos/seed/utility/600/800', featured: true, icon: <WaterPowerIcon /> },
    
    // Govt
    { key: 'cyberSafety', nameKey: 'Cyber Safety Center', descriptionKey: 'Detect threats and report cyber crimes.', categoryKey: 'govt', image: 'https://picsum.photos/seed/cybersecurity/400/500', icon: <ShieldCheckIcon className="w-8 h-8"/> },
    // ... (existing items)
    { key: 'govtSchemes', nameKey: 'govtSchemes', descriptionKey: 'govtSchemesDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/scheme/400/500', icon: <SchemeIcon className="w-8 h-8"/> },
    { key: 'legalHelp', nameKey: 'legalHelp', descriptionKey: 'legalHelpDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/legal/400/500', icon: <LegalHelpIcon className="w-8 h-8"/> },
    { key: 'complaintRegistration', nameKey: 'complaintRegistration', descriptionKey: 'lodgeComplaintDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/complaint/400/500', icon: <ComplaintIcon /> },
    { key: 'govtPortals', nameKey: 'govtPortals', descriptionKey: 'govtPortalsDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/portal/400/500', icon: <GovtPortalsIcon /> },
    { key: 'downloadCenter', nameKey: 'downloadCenter', descriptionKey: 'downloadCenterDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/download/400/500', icon: <DownloadIcon /> },
    { key: 'aadhaarServices', nameKey: 'aadhaarServices', descriptionKey: 'aadhaarServicesDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/aadhaar/400/500', icon: <UserCircleIcon /> },
    { key: 'passportSeva', nameKey: 'passportSeva', descriptionKey: 'passportSevaDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/passport/400/500', icon: <DocumentTextIcon /> },
    { key: 'digitalLocker', nameKey: 'digitalLocker', descriptionKey: 'digitalLockerDesc', categoryKey: 'govt', image: 'https://picsum.photos/seed/locker/400/500', icon: <KeyIcon className="w-8 h-8" /> },
    
    // Medical
    { key: 'findBloodBanks', nameKey: 'findBloodBanks', descriptionKey: 'findBloodBanksDesc', categoryKey: 'medical', image: 'https://picsum.photos/seed/blood/400/500', icon: <BloodBankIcon /> },
    { key: 'bookVaccination', nameKey: 'bookVaccination', descriptionKey: 'bookVaccinationDesc', categoryKey: 'medical', image: 'https://picsum.photos/seed/vaccine/400/500', icon: <HeartIcon className="w-8 h-8" /> },
    { key: 'emergencyAmbulance', nameKey: 'emergencyAmbulance', descriptionKey: 'emergencyAmbulanceDesc', categoryKey: 'medical', image: 'https://picsum.photos/seed/ambulance/400/500', icon: <AmbulanceIcon /> },
      
    // Transport
    { key: 'transportInfo', nameKey: 'transportInfo', descriptionKey: 'transportInfoDesc', categoryKey: 'transport', image: 'https://picsum.photos/seed/transport/600/800', icon: <TransportIcon className="w-8 h-8" /> },
    { key: 'metroCardRecharge', nameKey: 'metroCardRecharge', descriptionKey: 'metroCardRechargeDesc', categoryKey: 'transport', image: 'https://picsum.photos/seed/metro/400/500', icon: <PayBillsIcon className="w-8 h-8" /> },
    { key: 'parkingFinder', nameKey: 'parkingFinder', descriptionKey: 'parkingFinderDesc', categoryKey: 'transport', image: 'https://picsum.photos/seed/parking/400/500', icon: <ParkingIcon /> },
    
    // Utilities
    { key: 'wasteTracker', nameKey: 'wasteTracker', descriptionKey: 'wasteTrackerDesc', categoryKey: 'utilities', image: 'https://picsum.photos/seed/waste/400/500', icon: <WasteTrackerIcon /> },
    { key: 'newConnection', nameKey: 'newConnection', descriptionKey: 'newConnectionDesc', categoryKey: 'utilities', image: 'https://picsum.photos/seed/connection/400/500', icon: <NewConnectionIcon /> },
    
    // Community
    { key: 'localEvents', nameKey: 'localEvents', descriptionKey: 'localEventsDesc', categoryKey: 'community', image: 'https://picsum.photos/seed/events/400/500', icon: <LocalEventsIcon /> },
    { key: 'volunteer', nameKey: 'volunteer', descriptionKey: 'volunteerDesc', categoryKey: 'community', image: 'https://picsum.photos/seed/volunteer/400/500', icon: <VolunteerIcon /> },
    { key: 'communityCenters', nameKey: 'communityCenters', descriptionKey: 'communityCentersDesc', categoryKey: 'community', image: 'https://picsum.photos/seed/community/400/500', icon: <HomeIcon isActive /> },

    // Housing
    { key: 'propertyTax', nameKey: 'propertyTax', descriptionKey: 'propertyTaxDesc', categoryKey: 'housing', image: 'https://picsum.photos/seed/tax/400/500', icon: <PayBillsIcon className="w-8 h-8" /> },
    { key: 'landRecords', nameKey: 'landRecords', descriptionKey: 'landRecordsDesc', categoryKey: 'housing', image: 'https://picsum.photos/seed/land/400/500', icon: <DocumentTextIcon /> },

    // Education
    { key: 'schoolAdmissions', nameKey: 'schoolAdmissions', descriptionKey: 'schoolAdmissionsDesc', categoryKey: 'education', image: 'https://picsum.photos/seed/school/400/500', icon: <GovtPortalsIcon /> },
    { key: 'publicLibraries', nameKey: 'publicLibraries', descriptionKey: 'publicLibrariesDesc', categoryKey: 'education', image: 'https://picsum.photos/seed/library/400/500', icon: <GovtPortalsIcon /> },
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
    <button onClick={onClick} className={`px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 border transform hover:scale-105 ${isActive ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'}`}>
        {label}
    </button>
);

const FeaturedCard: React.FC<{ service: typeof services[0]; onClick: () => void; t: (key: any) => string; }> = ({ service, onClick, t }) => (
    <div onClick={onClick} className="relative w-full h-56 rounded-2xl overflow-hidden snap-center flex-shrink-0 cursor-pointer group shadow-lg tilt-card-deep">
        <img src={service.image} alt={t(service.nameKey as any)} className="absolute w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute top-4 left-4 text-white w-8 h-8 drop-shadow-lg">{service.icon}</div>
        <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-bold text-xl text-white drop-shadow-md">{t(service.nameKey as any)}</h3>
            <p className="text-xs text-gray-200 drop-shadow-md">{t(service.descriptionKey as any)}</p>
        </div>
    </div>
);

const ServiceCard: React.FC<{ service: typeof services[0]; onClick: () => void; t: (key: any) => string; }> = ({ service, onClick, t }) => (
    <div onClick={onClick} className="relative w-36 h-48 rounded-2xl overflow-hidden snap-start flex-shrink-0 cursor-pointer group shadow-md tilt-card-deep">
        <img src={service.image} alt={t(service.nameKey as any)} className="absolute w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-3 left-3 text-white w-6 h-6 drop-shadow-lg">{service.icon}</div>
        <h3 className="absolute bottom-0 left-0 p-3 font-bold text-sm text-white drop-shadow-md">{t(service.nameKey as any)}</h3>
    </div>
);

const ServiceListItem: React.FC<{ service: typeof services[0]; onClick: () => void; t: (key: any) => string; }> = ({ service, onClick, t }) => (
    <button onClick={onClick} className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden text-left group transform hover:-translate-y-1 transition-all duration-300 tilt-card">
        <img src={service.image} alt={t(service.nameKey as any)} className="w-full h-40 object-cover" />
        <div className="p-4">
             <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center text-gray-600 group-hover:text-teal-600 transition-colors duration-300">
                    {service.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{t(service.nameKey as any)}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{t(service.descriptionKey as any)}</p>
                </div>
            </div>
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
        const desc = t(service.descriptionKey as any);

        const matchesSearch = !searchQuery ||
            name.toLowerCase().includes(lowerCaseQuery) ||
            desc.toLowerCase().includes(lowerCaseQuery);
        return matchesSearch;
    }), [searchQuery, t, lowerCaseQuery]);

    const featuredServices = filteredServices.filter(s => s.featured);

    const serviceCategories = useMemo(() => categories.map(cat => ({
        ...cat,
        services: filteredServices.filter(s => s.categoryKey === cat.key)
    })).filter(cat => cat.services.length > 0), [filteredServices]);

    const displayCategories = activeCategory === 'all' ? serviceCategories : serviceCategories.filter(c => c.key === activeCategory);

    const delayClasses = ['animation-delay-50', 'animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250'];

    return (
        <div className="bg-gray-50 text-gray-800 min-h-full">
            <div className="p-4 sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10">
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                     <button onClick={() => setActiveCategory('all')} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border transform hover:scale-105 ${activeCategory === 'all' ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-500'}`}>
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

            <div className="p-4 pt-2">
                {filteredServices.length === 0 && searchQuery ? (
                     <div className="text-center py-10 text-gray-500">
                        <h2 className="text-xl font-bold mb-2">{t('noResultsFound')}</h2>
                        <p>{t('noResultsMatch', { query: searchQuery })}</p>
                    </div>
                ) : (activeCategory === 'all' && !searchQuery) ? (
                    <div className="space-y-8">
                        {featuredServices.length > 0 && (
                            <section>
                                <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
                                   {featuredServices.map(service => (
                                        <FeaturedCard key={service.key} service={service} onClick={() => handleCardClick(service.key)} t={t} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {serviceCategories.map(category => (
                             <section key={category.key}>
                                <h2 className="text-2xl font-bold mb-4 text-gray-900">{t(category.nameKey as any)}</h2>
                                <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
                                    {category.services.map(service => (
                                        <ServiceCard key={service.key} service={service} onClick={() => handleCardClick(service.key)} t={t} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayCategories.flatMap(category => category.services).map((service, index) => (
                            <div key={service.key} className={`animate-fadeInUp ${delayClasses[index % delayClasses.length]}`}>
                                <ServiceListItem service={service} onClick={() => handleCardClick(service.key)} t={t} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;