
import React, { useContext, useState, useEffect, useRef } from 'react';
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
    WrenchIcon,
    ScaleIcon,
    BuildingOfficeIcon,
    KeyIcon,
    CheckCircleIcon,
    UserGroupIcon
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

const UnifiedIDCard: React.FC<{ user: any }> = ({ user }) => (
    <div className="relative group perspective-1000 animate-fadeInUp">
        <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-6 rounded-3xl shadow-2xl text-white border border-white/10 relative overflow-hidden transform transition-all duration-500 group-hover:rotate-x-2 group-hover:scale-[1.02]">
            <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldIcon className="w-32 h-32"/></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-xl font-black tracking-tighter italic">UNIFIED_ID</h2>
                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Citizen Verification Token</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/20">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UnifiedID_Mub" className="w-8 h-8 grayscale invert" alt="qr"/>
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-2xl font-bold tracking-tight">{user.name.toUpperCase()}</p>
                        <p className="text-xs opacity-60 font-mono tracking-widest mt-1">
                            {user.aadhaar.replace(/(.{4})/g, '$1 ')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] opacity-40 uppercase font-bold">Residency Score</p>
                        <p className="text-xl font-black text-teal-400">920</p>
                    </div>
                </div>
            </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ id: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, checked, onChange }) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
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
        showToast(enabled ? 'Shake to SOS active.' : 'Shake to SOS disabled.');
    };

    const handleSecretWordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const enabled = e.target.checked;
        setIsSecretWordEnabled(enabled);
        const updatedUser = { ...user, isSecretWordSosEnabled: enabled };
        await mockApi.updateUser(updatedUser);
        setUser(updatedUser);
        showToast(enabled ? t('secretWordEnabledToast') : 'Voice SOS disabled.');
    };

    const handleSaveSecretPhrase = async () => {
        if (!user || !secretPhrase.trim()) return;
        const updatedUser = { ...user, sosSecretPhrase: secretPhrase.trim() };
        await mockApi.updateUser(updatedUser);
        setUser(updatedUser);
        showToast(t('saveSuccess'));
    };

    if (!user) return <div className="p-4">Loading user profile...</div>;
    
    return (
        <div className="bg-slate-50 min-h-full animate-fadeInUp">
            <div className="p-6 space-y-6">
                
                {/* Unified ID Card */}
                <UnifiedIDCard user={user} />

                {/* Safety & Emergency Settings */}
                <SectionCard title="Safety Protocol" className="animate-fadeInUp border-red-100 bg-red-50/10">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                <PhoneVibrateIcon className="w-6 h-6"/>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-700">Discreet Shake SOS</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Triple-Shake Activation</p>
                            </div>
                        </div>
                        <ToggleSwitch id="shakeSosProfile" checked={shakeToSosEnabled} onChange={handleShakeToSosChange} />
                    </div>

                    {/* Shake & Speak Section */}
                    <div className="p-4 border-t border-red-100/50">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                    <MicrophoneIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-700">{t('secretWordSos')}</span>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Shake once & say phrase</p>
                                </div>
                            </div>
                            <ToggleSwitch id="secretWordSos" checked={isSecretWordEnabled} onChange={handleSecretWordChange} />
                        </div>
                        
                        {isSecretWordEnabled && (
                            <div className="mt-4 space-y-3 animate-fadeInUp">
                                <label className="block text-xs font-bold text-slate-500 uppercase">{t('setSecretPhrase')}</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={secretPhrase}
                                        onChange={e => setSecretPhrase(e.target.value)}
                                        placeholder="e.g. Help Me"
                                        className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                    />
                                    <button onClick={handleSaveSecretPhrase} className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors text-sm">{t('save')}</button>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight italic">{t('secretWordDisclaimer')}</p>
                            </div>
                        )}
                    </div>

                    <ProfileLink title="Emergency Contacts" icon={<UserGroupIcon className="w-6 h-6" />} onClick={() => setView('emergencyContacts')} />
                </SectionCard>

                <SectionCard title="City Activity" className="animate-fadeInUp animation-delay-100">
                    <ProfileLink title="Track Applications" icon={<CheckCircleIcon className="w-6 h-6" />} onClick={() => setView('trackApplications')} />
                    <ProfileLink title={t('myReports')} icon={<MyReportsIcon className="w-6 h-6" />} onClick={() => setView('allReports')} />
                    <ProfileLink title="SOS History" icon={<ShieldIcon className="w-6 h-6" />} onClick={() => setView('sosHistory')} />
                </SectionCard>

                <SectionCard title="Community & Support" className="animate-fadeInUp animation-delay-150">
                    <ProfileLink title="Request Medical Aid" icon={<HeartPlusIcon className="w-6 h-6" />} onClick={() => setView('requestMedicalHelp')} />
                </SectionCard>

                <SectionCard title="Find Nearby" className="animate-fadeInUp animation-delay-200">
                    <ProfileLink title="Hospitals" icon={<HospitalIcon />} onClick={() => navigateToMapWithFilter('Hospital')} />
                    <ProfileLink title="Petrol Bunks" icon={<FuelIcon className="w-6 h-6"/>} onClick={() => navigateToMapWithFilter('Petrol Bunk')} />
                    <ProfileLink title="Govt. Offices" icon={<BuildingOfficeIcon className="w-6 h-6" />} onClick={() => navigateToMapWithFilter('Govt Office')} />
                </SectionCard>

                <SectionCard title="Preferences" className="animate-fadeInUp animation-delay-300">
                    <ProfileLink title="Account Settings" icon={<KeyIcon className="w-6 h-6"/>} onClick={() => setView('accountSettings')} />
                    <ProfileLink title="About Us" icon={<InfoIcon className="w-6 h-6" />} onClick={() => setView('aboutUs')} />
                    <ProfileLink title={t('helpSupport')} icon={<HeadsetIcon className="w-6 h-6" />} onClick={() => setView('helpSupport')} />
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
