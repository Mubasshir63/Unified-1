import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { EmergencyContact } from '../types';
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
    HeartPlusIcon,
    HospitalIcon,
    FuelIcon,
    BuildingOfficeIcon,
    KeyIcon,
    CheckCircleIcon,
    UserGroupIcon
} from '../components/icons/NavIcons';
import { useTranslation } from '../hooks/useTranslation';

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-200/60 ${className}`}>
        <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] p-5 pb-2">{title}</h3>
        <div className="divide-y divide-slate-50">{children}</div>
    </div>
);

const ProfileLink: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void; }> = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center p-5 text-left group transition-colors hover:bg-slate-50">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-slate-100 group-hover:bg-teal-50 text-slate-600 group-hover:text-teal-600 flex items-center justify-center transition-colors shadow-inner">
                {icon}
            </div>
            <span className="font-bold text-gray-700 tracking-tight">{title}</span>
        </div>
        <div className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-teal-500">
            <ArrowRightIcon />
        </div>
    </button>
);

const UnifiedIDCard: React.FC<{ user: any }> = ({ user }) => (
    <div className="relative group perspective-1000 animate-fadeInUp">
        <div className="w-full bg-slate-900 p-7 rounded-[2.5rem] shadow-2xl text-white border border-white/5 relative overflow-hidden transform transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldIcon className="w-32 h-32"/></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter italic text-teal-400">UNIFIED_ID</h2>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Verified Digital Citizen</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UnifiedID_Mub" className="w-8 h-8 grayscale invert" alt="qr"/>
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-2xl font-black tracking-tight">{user.name.toUpperCase()}</p>
                        <p className="text-xs opacity-40 font-mono tracking-[0.2em] mt-2">
                            {user.aadhaar.replace(/(.{4})/g, '$1 ')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] opacity-40 uppercase font-black tracking-widest">Residency Score</p>
                        <p className="text-2xl font-black text-teal-400">920</p>
                    </div>
                </div>
            </div>
             <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ id: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, checked, onChange }) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-12 h-7 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-teal-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
    </label>
);

interface ProfilePageProps { 
    setView: (view: string) => void;
    onEditProfileClick: () => void;
    navigateToMapWithFilter: (category: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setView, onEditProfileClick, navigateToMapWithFilter }) => {
    const { user, setUser, logout } = useContext(UserContext);
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    
    const [shakeToSosEnabled, setShakeToSosEnabled] = useState(localStorage.getItem('shakeToSosEnabled') === 'true');
    const [secretPhrase, setSecretPhrase] = useState(user?.sosSecretPhrase || '');
    const [isSecretWordEnabled, setIsSecretWordEnabled] = useState(user?.isSecretWordSosEnabled || false);

    const handleShakeToSosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = e.target.checked;
        setShakeToSosEnabled(enabled);
        localStorage.setItem('shakeToSosEnabled', String(enabled));
        showToast(enabled ? 'Triple-shake SOS active.' : 'Triple-shake SOS disabled.');
    };

    const handleSecretWordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const enabled = e.target.checked;
        setIsSecretWordEnabled(enabled);
        const updatedUser = { ...user, isSecretWordSosEnabled: enabled };
        await mockApi.updateUser(updatedUser);
        setUser(updatedUser);
        showToast(enabled ? 'Voice SOS enabled.' : 'Voice SOS disabled.');
    };

    const handleSaveSecretPhrase = async () => {
        if (!user || !secretPhrase.trim()) return;
        const updatedUser = { ...user, sosSecretPhrase: secretPhrase.trim() };
        await mockApi.updateUser(updatedUser);
        setUser(updatedUser);
        showToast(t('saveSuccess'));
    };

    if (!user) return <div className="p-10 text-center font-bold text-gray-400">Initializing User Core...</div>;
    
    return (
        <div className="bg-slate-50 min-h-full animate-fadeInUp pb-24">
            <div className="p-6 space-y-6">
                
                {/* Unified ID Card */}
                <UnifiedIDCard user={user} />

                {/* Safety Protocol Section */}
                <SectionCard title="Emergency Protocols" className="border-red-50 bg-red-50/5">
                    <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
                                <PhoneVibrateIcon className="w-6 h-6"/>
                            </div>
                            <div>
                                <span className="font-bold text-gray-800 tracking-tight">Triple-Shake SOS</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Discreet Activation</p>
                            </div>
                        </div>
                        <ToggleSwitch id="shakeSosProfile" checked={shakeToSosEnabled} onChange={handleShakeToSosChange} />
                    </div>

                    <div className="p-5 border-t border-red-50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
                                    <MicrophoneIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-800 tracking-tight">Voice Recognition SOS</span>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Custom Trigger Word</p>
                                </div>
                            </div>
                            <ToggleSwitch id="secretWordSos" checked={isSecretWordEnabled} onChange={handleSecretWordChange} />
                        </div>
                        
                        {isSecretWordEnabled && (
                            <div className="mt-4 space-y-3 animate-fadeInUp">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('setSecretPhrase')}</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={secretPhrase}
                                        onChange={e => setSecretPhrase(e.target.value)}
                                        placeholder="e.g. Help Me Now"
                                        className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-100 outline-none text-sm font-bold text-gray-700 shadow-inner"
                                    />
                                    <button onClick={handleSaveSecretPhrase} className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-lg">Save</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <ProfileLink title="Emergency Contacts" icon={<UserGroupIcon className="w-6 h-6" />} onClick={() => setView('emergencyContacts')} />
                </SectionCard>

                <SectionCard title="City Activity Hub">
                    <ProfileLink title="Track Applications" icon={<CheckCircleIcon className="w-6 h-6" />} onClick={() => setView('trackApplications')} />
                    <ProfileLink title="My Reported Issues" icon={<MyReportsIcon className="w-6 h-6" />} onClick={() => setView('allReports')} />
                    <ProfileLink title="SOS Alert History" icon={<ShieldIcon className="w-6 h-6" />} onClick={() => setView('sosHistory')} />
                </SectionCard>

                <SectionCard title="Medical Assistance">
                    <ProfileLink title="Request Medical Aid" icon={<HeartPlusIcon className="w-6 h-6" />} onClick={() => setView('requestMedicalHelp')} />
                </SectionCard>

                <SectionCard title="Nearby Locations">
                    <ProfileLink title="Emergency Hospitals" icon={<HospitalIcon />} onClick={() => navigateToMapWithFilter('Hospital')} />
                    <ProfileLink title="Fuel Stations" icon={<FuelIcon className="w-6 h-6"/>} onClick={() => navigateToMapWithFilter('Petrol Bunk')} />
                    <ProfileLink title="Official Govt. Offices" icon={<BuildingOfficeIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Govt Office')} />
                </SectionCard>

                <SectionCard title="System Preferences">
                    <ProfileLink title="Account & Security" icon={<KeyIcon className="w-6 h-6"/>} onClick={() => setView('accountSettings')} />
                    <ProfileLink title="About UNIFIED" icon={<InfoIcon className="w-6 h-6" />} onClick={() => setView('aboutUs')} />
                    <ProfileLink title="Help & Support" icon={<HeadsetIcon className="w-6 h-6" />} onClick={() => setView('helpSupport')} />
                </SectionCard>

                <div className="pt-2">
                    <button onClick={logout} className="w-full flex items-center justify-center p-5 text-red-600 font-black text-sm uppercase tracking-[0.2em] bg-white rounded-3xl shadow-sm hover:bg-red-50 transition-all border border-red-100 active:scale-95">
                        <LogoutIcon className="w-6 h-6 mr-3" /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;