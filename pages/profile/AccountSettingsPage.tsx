
import React, { useState, useContext, useEffect } from 'react';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';
import * as mockApi from '../../api/mockApi';
import { Language, User } from '../../types';
import { LANGUAGES } from '../../translations';
import { KeyIcon, NotificationIcon, LanguageIcon, PhoneVibrateIcon, MicrophoneIcon, CheckCircleIcon } from '../../components/icons/NavIcons';
import { UserContext } from '../../contexts/UserContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const SettingsItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }> = ({ icon, title, subtitle, children }) => (
    <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                {icon}
            </div>
            <div className="flex-1">
                <span className="font-semibold text-slate-700">{title}</span>
                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
        </div>
        <div className="flex-shrink-0 ml-4">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{ id: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, checked, onChange }) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer"><input type="checkbox" id={id} checked={checked} onChange={onChange} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-teal-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div></label>
);

interface AccountSettingsPageProps {
  onBack: () => void;
}

const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ onBack }) => {
    const { user, setUser } = useContext(UserContext);
    const { t, language, setLanguage } = useTranslation();
    const { showToast } = useNotifications();

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [prefs, setPrefs] = useState(() => user?.notificationPreferences || { email: true, push: true });

    const handlePrefChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;
        const { id, checked } = e.target;
        const newPrefs = { ...prefs, [id]: checked };
        setPrefs(newPrefs);
        const updatedUser = await mockApi.updateUser({ ...user, notificationPreferences: newPrefs });
        setUser(updatedUser); 
        showToast('Notification preferences updated.');
    };
    
    return (
        <ServicePageLayout title="Account Settings" subtitle="Manage your account details and preferences" onBack={onBack}>
            <div className="space-y-6">
                
                <div>
                    <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider px-4 pb-2">Account</h3>
                    <div className="space-y-4">
                        <SettingsItem icon={<KeyIcon className="w-6 h-6"/>} title="Change Password">
                            <button onClick={() => setIsPasswordModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                Change
                            </button>
                        </SettingsItem>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider px-4 pb-2">Notifications</h3>
                    <div className="space-y-4">
                        <SettingsItem icon={<NotificationIcon />} title="Push Notifications" subtitle="For real-time alerts and updates.">
                            <ToggleSwitch id="push" checked={prefs.push} onChange={handlePrefChange} />
                        </SettingsItem>
                        <SettingsItem icon={<NotificationIcon />} title="Email Notifications" subtitle="For weekly summaries and important announcements.">
                            <ToggleSwitch id="email" checked={prefs.email} onChange={handlePrefChange} />
                        </SettingsItem>
                    </div>
                </div>
                 <div>
                    <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider px-4 pb-2">Language</h3>
                     <SettingsItem icon={<LanguageIcon />} title={t('language')} subtitle={`Current: ${LANGUAGES[language]}`}>
                        <div className="flex items-center space-x-1 p-1 bg-slate-200 rounded-lg">
                            {(Object.keys(LANGUAGES) as Language[]).map(lang => (
                                <button key={lang} onClick={() => setLanguage(lang)} className={`px-2.5 py-1 text-sm font-semibold rounded-md transition-colors ${language === lang ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}>{lang.toUpperCase()}</button>
                            ))}
                        </div>
                    </SettingsItem>
                </div>
            </div>
            
            {isPasswordModalOpen && user && (
                <ChangePasswordModal 
                    user={user}
                    onClose={() => setIsPasswordModalOpen(false)}
                />
            )}
        </ServicePageLayout>
    );
};

export default AccountSettingsPage;
