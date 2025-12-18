import React, { useState, useEffect } from 'react';
import type { LocationData, Language, User } from '../types';
import { INDIAN_STATES, LOCATION_COORDS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';
import { LANGUAGES } from '../translations';
import { ArrowLeftIcon } from '../components/icons/NavIcons';


interface LoginPageProps {
  onLogin: (identifier: string, password: string) => void;
  onGovLogin: (email: string, password: string) => void;
  onRegister: (userData: Omit<User, 'profilePicture' | 'role' | 'email'>) => void;
}

// Sub-components are defined outside the main component to prevent re-mounting on every render.
// This is the key fix for the input refreshing issue.

const LocationSetup: React.FC<{ onLocationSet: (location: LocationData) => void }> = ({ onLocationSet }) => {
    const { t } = useTranslation();
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [states, setStates] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);

    useEffect(() => {
        if (country === 'India') {
            setStates(Object.keys(INDIAN_STATES));
        } else {
            setStates([]);
        }
        setState('');
        setDistrict('');
    }, [country]);

    useEffect(() => {
        if (state && country === 'India') {
            setDistricts(INDIAN_STATES[state] || []);
        } else {
            setDistricts([]);
        }
        setDistrict('');
    }, [state]);

    const handleConfirm = () => {
        if (country && state && district) {
            const coords = LOCATION_COORDS[district] || LOCATION_COORDS[state] || { lat: 20.5937, lng: 78.9629 }; // Default to India center
            onLocationSet({ country, state, district, coords });
        }
    };

    const selectClasses = "w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800";

    return (
        <div className="w-full max-w-md mx-auto p-8 space-y-6 animate-fadeInUp">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">{t('setYourLocation')}</h2>
                <p className="text-gray-500 mt-2">{t('locationPersonalize')}</p>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">{t('country')}</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClasses}>
                        <option>India</option>
                    </select>
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">{t('state')}</label>
                    <select value={state} onChange={(e) => setState(e.target.value)} className={selectClasses} disabled={!country}>
                        <option value="">{t('selectState')}</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">{t('districtCity')}</label>
                    <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectClasses} disabled={!state}>
                        <option value="">{t('selectDistrict')}</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
            <button
                onClick={handleConfirm}
                disabled={!district}
                className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform shadow-lg"
            >
                {t('confirmAndContinue')}
            </button>
        </div>
    );
};

type AuthMode = 'login' | 'signup';
type LoginType = 'mobile' | 'aadhaar';
type View = 'selection' | 'citizen' | 'government';

const SelectionView: React.FC<{
  setView: (view: View) => void;
  t: (key: any) => string;
}> = ({ setView, t }) => (
    <div className="w-full max-w-sm mx-auto text-center animate-scaleIn">
        <div className="mb-4">
            <svg height="35" viewBox="0 0 200 40" className="w-48 mx-auto">
                <defs>
                    <linearGradient id="tricolorGradientLogin" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF9933" />
                        <stop offset="33%" stopColor="#FF9933" />
                        <stop offset="33.01%" stopColor="#FFFFFF" />
                        <stop offset="48%" stopColor="#FFFFFF" />
                        <stop offset="48.01%" stopColor="#000080" />
                        <stop offset="51.99%" stopColor="#000080" />
                        <stop offset="52%" stopColor="#FFFFFF" />
                        <stop offset="66.99%" stopColor="#FFFFFF" />
                        <stop offset="67%" stopColor="#138808" />
                        <stop offset="100%" stopColor="#138808" />
                    </linearGradient>
                </defs>
                <text
                    x="50%"
                    y="50%"
                    dy=".35em"
                    textAnchor="middle"
                    fontSize="30"
                    fontFamily="Inter, sans-serif"
                    fontWeight="800"
                    fill="url(#tricolorGradientLogin)"
                    stroke="#475569"
                    strokeWidth="0.3"
                >
                    UNIFIED
                </text>
            </svg>
            <p className="mt-2 text-sm text-slate-600 font-medium tracking-wider">
                Smart City in Smart Phone
            </p>
        </div>
        <div className="p-8 space-y-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="space-y-4">
                 <button onClick={() => setView('citizen')} className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-lg">
                    Citizen Login / Signup
                </button>
                 <button onClick={() => setView('government')} className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 transform hover:scale-105 transition-transform shadow-lg">
                    Government Login
                </button>
            </div>
        </div>
        <p className="text-gray-600 text-xs mt-6">
            {t('tagline')}
        </p>
    </div>
);

const CitizenAuthView: React.FC<{
    handleBack: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    authMode: AuthMode;
    setAuthMode: (mode: AuthMode) => void;
    loginType: LoginType;
    setLoginType: (type: LoginType) => void;
    handleCitizenSubmit: (e: React.FormEvent) => void;
    name: string; setName: (name: string) => void;
    identifier: string; setIdentifier: (id: string) => void;
    phone: string; setPhone: (phone: string) => void;
    aadhaar: string; setAadhaar: (aadhaar: string) => void;
    password: string; setPassword: (pw: string) => void;
    confirmPassword: string; setConfirmPassword: (pw: string) => void;
    t: (key: any) => string;
}> = ({
    handleBack, language, setLanguage, authMode, setAuthMode, loginType, setLoginType, handleCitizenSubmit,
    name, setName, identifier, setIdentifier, phone, setPhone, aadhaar, setAadhaar,
    password, setPassword, confirmPassword, setConfirmPassword, t
}) => {
    const citizenInputClasses = "w-full px-4 py-3 bg-gray-50/50 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";
    const loginPlaceholder = loginType === 'mobile' ? t('mobileNumber') : t('aadhaarNumber');
    const loginInputType = loginType === 'mobile' ? 'tel' : 'text';
    const loginInputMaxLength = loginType === 'mobile' ? 10 : 12;

    return (
        <div className="w-full max-w-sm mx-auto p-8 space-y-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl relative animate-scaleIn">
             <button onClick={handleBack} className="absolute top-4 left-4 p-2 text-gray-500 hover:bg-gray-200/60 rounded-full transition-colors"><ArrowLeftIcon/></button>
             <div className="absolute top-4 right-4">
                <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="bg-white/50 border border-gray-300 rounded-md py-1 px-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500">
                    {Object.entries(LANGUAGES).map(([code, name]) => (<option key={code} value={code}>{name}</option>))}
                </select>
            </div>
            <h2 className="text-center text-3xl font-bold text-gray-800 pt-8">{authMode === 'login' ? 'Citizen Login' : 'Citizen Signup'}</h2>
            
            {authMode === 'login' && (
              <div className="bg-gray-100/70 p-1 rounded-xl flex animate-fadeInUp animation-delay-100">
                  <button type="button" onClick={() => setLoginType('mobile')} className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${loginType === 'mobile' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200/50'}`}>{t('mobileNo')}</button>
                  <button type="button" onClick={() => setLoginType('aadhaar')} className={`w-full py-2.5 text-sm font-medium rounded-lg transition-colors ${loginType === 'aadhaar' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200/50'}`}>{t('aadhaar')}</button>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleCitizenSubmit}>
                {authMode === 'signup' && (<>
                    <input type="text" placeholder={t('fullName')} value={name} onChange={(e) => setName(e.target.value)} required className={`${citizenInputClasses} animate-fadeInUp animation-delay-100`} />
                    <input type="tel" placeholder={t('mobileNumber')} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} required className={`${citizenInputClasses} animate-fadeInUp animation-delay-200`} />
                    <input type="text" placeholder={t('aadhaarNumber')} value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))} required className={`${citizenInputClasses} animate-fadeInUp animation-delay-300`} />
                </>)}
                {authMode === 'login' && (
                    <input type={loginInputType} placeholder={loginPlaceholder} value={identifier} onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, '').slice(0, loginInputMaxLength))} required className={`${citizenInputClasses} animate-fadeInUp animation-delay-200`} />
                )}
                <input type="password" placeholder={authMode === 'login' ? t('password') : 'Create Password (or OTP)'} value={password} onChange={(e) => setPassword(e.target.value)} required className={`${citizenInputClasses} animate-fadeInUp animation-delay-400`} />
                {authMode === 'signup' && (<input type="password" placeholder={t('confirmPassword')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={`${citizenInputClasses} animate-fadeInUp animation-delay-500`} />)}
                
                <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-lg animate-fadeInUp animation-delay-600">{authMode === 'login' ? t('signIn') : t('signUp')}</button>
            </form>

            <div className="text-center text-sm animate-fadeInUp animation-delay-600">
                <p className="text-gray-600">
                    {authMode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}
                    <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="font-medium text-green-600 hover:underline ml-1">{authMode === 'login' ? t('signUp') : t('signIn')}</button>
                </p>
            </div>
        </div>
    );
};

const GovernmentAuthView: React.FC<{
    handleBack: () => void;
    govEmail: string;
    setGovEmail: (email: string) => void;
    govPassword: string;
    setGovPassword: (pw: string) => void;
    handleGovSubmit: (e: React.FormEvent) => void;
}> = ({ handleBack, govEmail, setGovEmail, govPassword, setGovPassword, handleGovSubmit }) => {
    const govInputClasses = "w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-white placeholder-slate-400";
    return (
        <div className="w-full max-w-sm mx-auto p-8 space-y-6 bg-slate-900 bg-grid-pattern backdrop-blur-xl rounded-3xl shadow-2xl relative text-white animate-scaleIn">
            <button onClick={handleBack} className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-700/60 rounded-full transition-colors"><ArrowLeftIcon/></button>
            <div className="text-center space-y-3 pt-8 animate-fadeInUp">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-teal-400">
                    <path d="M12 4L4 8v5c0 4.4 3.58 8.25 8 9.25 4.42-1 8-4.85 8-9.25V8l-8-4zm0 1.5l6 3v4.5c0 3.32-2.67 6.18-6 6.92-3.33-.74-6-3.6-6-6.92V8.5l6-3zM12 12l3.5-2-1.5 4h-4l-1.5-4z" fill="currentColor"/>
                </svg>
                <h2 className="text-2xl font-bold text-white">Control Center</h2>
                 <p className="text-slate-400 text-sm">UNIFIED Government Module</p>
            </div>
            <form className="space-y-4" onSubmit={handleGovSubmit}>
                <input type="email" placeholder="Email / Govt ID" value={govEmail} onChange={(e) => setGovEmail(e.target.value)} required className={`${govInputClasses} animate-fadeInUp animation-delay-100`} />
                <input type="password" placeholder="Password" value={govPassword} onChange={(e) => setGovPassword(e.target.value)} required className={`${govInputClasses} animate-fadeInUp animation-delay-200`} />
                <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-500 transform hover:scale-105 transition-transform shadow-lg shadow-teal-900/50 animate-fadeInUp animation-delay-300">SECURE SIGN IN</button>
            </form>
        </div>
    );
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGovLogin, onRegister }) => {
    const { t, setLanguage, language } = useTranslation();
    const [view, setView] = useState<View>('selection');
    const [step, setStep] = useState(1);
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [loginType, setLoginType] = useState<LoginType>('mobile');
    
    // Login state
    const [identifier, setIdentifier] = useState('');
    
    // Common state
    const [password, setPassword] = useState('');

    // Signup state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Gov Login state
    const [govEmail, setGovEmail] = useState('');
    const [govPassword, setGovPassword] = useState('');

    const handleCitizenSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authMode === 'login') {
            if (identifier && password) {
                onLogin(identifier, password);
            }
        } else { // signup
            if (name && phone && aadhaar && password && password === confirmPassword) {
                setStep(2); // Go to location step
            } else if (password !== confirmPassword) {
                alert("Passwords don't match!");
            }
        }
    };

    const handleGovSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (govEmail && govPassword) {
            onGovLogin(govEmail, govPassword);
        }
    };

    const handleLocationSet = (location: LocationData) => {
        // This is only called after the signup form (step 1) is completed
        onRegister({ name, phone, aadhaar, password, location });
    };

    const resetForms = () => {
        setStep(1);
        setAuthMode('login');
        setLoginType('mobile');
        setIdentifier('');
        setPassword('');
        setName('');
        setPhone('');
        setAadhaar('');
        setConfirmPassword('');
        setGovEmail('');
        setGovPassword('');
    };
    
    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            return;
        }
        setView('selection');
        setTimeout(resetForms, 300);
    }
    
    const renderContent = () => {
        switch (view) {
            case 'citizen':
                if (step === 2) {
                    return (
                        <div key="location" className="w-full max-w-sm mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl animate-scaleIn">
                            <LocationSetup onLocationSet={handleLocationSet} />
                        </div>
                    );
                }
                return (
                    <CitizenAuthView
                        handleBack={handleBack}
                        language={language} setLanguage={setLanguage}
                        authMode={authMode} setAuthMode={setAuthMode}
                        loginType={loginType} setLoginType={setLoginType}
                        handleCitizenSubmit={handleCitizenSubmit}
                        name={name} setName={setName}
                        identifier={identifier} setIdentifier={setIdentifier}
                        phone={phone} setPhone={setPhone}
                        aadhaar={aadhaar} setAadhaar={setAadhaar}
                        password={password} setPassword={setPassword}
                        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                        t={t}
                    />
                );
            case 'government':
                return (
                    <GovernmentAuthView
                        handleBack={handleBack}
                        govEmail={govEmail} setGovEmail={setGovEmail}
                        govPassword={govPassword} setGovPassword={setGovPassword}
                        handleGovSubmit={handleGovSubmit}
                    />
                );
            case 'selection':
            default:
                return <SelectionView setView={setView} t={t} />;
        }
    };

    return (
        <div className="h-full w-full grid place-items-center bg-gradient-to-br from-cyan-100 to-blue-200 p-4">
            {renderContent()}
        </div>
    );
};

export default LoginPage;