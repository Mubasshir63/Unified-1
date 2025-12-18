
import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { Language, EmergencyContact, Page } from '../types';
import * as mockApi from '../api/mockApi';
import {
    ArrowRightIcon,
    MyReportsIcon,
    HeadsetIcon,
    ShieldIcon,
    InfoIcon,
    LogoutIcon,
    PhoneVibrateIcon,
    MicrophoneIcon,
    PhoneIcon,
    PlusCircleIcon,
    TrashIcon,
    XMarkIcon,
    HeartPlusIcon,
    HospitalIcon,
    FuelIcon,
    WrenchIcon,
    ScaleIcon,
    BuildingOfficeIcon,
    KeyIcon
} from '../components/icons/NavIcons';
import { useTranslation } from '../hooks/useTranslation';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200/80 ${className}`}>
        <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider p-4 pb-2">{title}</h3>
        <div className="divide-y divide-slate-100">{children}</div>
    </div>
);

const ProfileLink: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void; }> = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center p-4 text-left group transition-colors hover:bg-slate-50">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-600 flex items-center justify-center transition-colors">
                {icon}
            </div>
            <span className="font-semibold text-slate-700">{title}</span>
        </div>
        <div className="text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-600">
            <ArrowRightIcon />
        </div>
    </button>
);

interface ProfilePageProps { 
    setView: (view: string) => void;
    onEditProfileClick: () => void;
    navigateToMapWithFilter: (category: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setView, onEditProfileClick, navigateToMapWithFilter }) => {
    const { user, logout } = useContext(UserContext);
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    
    const [isEmergencyContactsOpen, setIsEmergencyContactsOpen] = useState(false);
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');

    useEffect(() => { 
        mockApi.getEmergencyContacts().then(setContacts);
    }, []);
    
    const handleAddContact = async () => { 
        if (newContactName.trim() && newContactPhone.trim()) { 
            const newContact = await mockApi.addEmergencyContact(newContactName.trim(), newContactPhone.trim());
            setContacts(prev => [...prev, newContact]);
            setNewContactName(''); 
            setNewContactPhone(''); 
            setIsAddingContact(false); 
            showToast('Emergency contact added!'); 
        } 
    };
    
    const handleDeleteContact = async (id: number) => { 
        const success = await mockApi.deleteEmergencyContact(id);
        if (success) {
            setContacts(prev => prev.filter(c => c.id !== id)); 
            showToast('Emergency contact removed.'); 
        }
    };
    
    const handleCallContact = (phone: string) => { window.location.href = `tel:${phone}`; };

    if (!user) return <div className="p-4">Loading user profile...</div>;
    
    return (
        <div className="bg-slate-50 min-h-full animate-fadeInUp">
            <div className="relative p-6 bg-gradient-to-br from-teal-600 to-green-700 text-white rounded-b-3xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-8 translate-y-8 opacity-50"></div>
                <div className="relative flex items-center space-x-5">
                    <img src={user.profilePicture} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white/50 shadow-lg" />
                    <div>
                        <h1 className="text-3xl font-bold [text-shadow:_1px_1px_3px_rgb(0_0_0_/_0.2)]">{user.name}</h1>
                        <p className="text-teal-100">{user.location.district}, {user.location.state}</p>
                        <button onClick={onEditProfileClick} className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 text-xs font-bold rounded-full backdrop-blur-sm transition">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                <SectionCard title="My Activity" className="animate-fadeInUp animation-delay-100">
                    <ProfileLink title={t('myReports')} icon={<MyReportsIcon className="w-6 h-6" />} onClick={() => setView('allReports')} />
                    <ProfileLink title="SOS History" icon={<ShieldIcon className="w-6 h-6" />} onClick={() => setView('sosHistory')} />
                </SectionCard>
                <SectionCard title="Community & Support" className="animate-fadeInUp animation-delay-150">
                    <ProfileLink title="Request Medical Aid" icon={<HeartPlusIcon className="w-6 h-6" />} onClick={() => setView('requestMedicalHelp')} />
                </SectionCard>
                <SectionCard title="Find Nearby" className="animate-fadeInUp animation-delay-200">
                    <ProfileLink title="Hospitals" icon={<HospitalIcon />} onClick={() => navigateToMapWithFilter('Hospital')} />
                    <ProfileLink title="Petrol Bunks" icon={<FuelIcon className="w-6 h-6"/>} onClick={() => navigateToMapWithFilter('Petrol Bunk')} />
                    <ProfileLink title="Mechanic Sheds" icon={<WrenchIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Mechanic')} />
                    <ProfileLink title="Ration Shops" icon={<ScaleIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Ration Shop')} />
                    <ProfileLink title="Govt. Offices" icon={<BuildingOfficeIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Govt Office')} />
                </SectionCard>
                <SectionCard title="Settings & More" className="animate-fadeInUp animation-delay-300">
                    <ProfileLink title="Account Settings" icon={<KeyIcon className="w-6 h-6"/>} onClick={() => setView('accountSettings')} />
                    <ProfileLink title="About Us" icon={<InfoIcon className="w-6 h-6" />} onClick={() => setView('aboutUs')} />
                    <ProfileLink title={t('helpSupport')} icon={<HeadsetIcon className="w-6 h-6" />} onClick={() => showToast('Help & Support coming soon!')} />
                </SectionCard>
                <div className="animate-fadeInUp animation-delay-400">
                    <button onClick={logout} className="w-full flex items-center justify-center p-4 text-red-600 font-bold bg-white rounded-2xl shadow-sm hover:bg-red-50 transition-colors border border-gray-200/80">
                        <LogoutIcon className="w-6 h-6 mr-2" /> {t('logOut')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;