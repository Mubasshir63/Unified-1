import React, { useState } from 'react';
import type { LocationData, User } from '../types';
import { INDIAN_STATES, LOCATION_COORDS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';
import { ArrowLeftIcon } from '../components/icons/NavIcons';

interface LoginPageProps {
  onLogin: (identifier: string, password: string) => void;
  onGovLogin: (email: string, password: string) => void;
  onRegister: (userData: Omit<User, 'profilePicture' | 'role' | 'email'>) => void;
}

const TricolorLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => (
    <div className="flex flex-col items-center">
        <svg height={size === 'lg' ? "50" : "30"} viewBox="0 0 200 40" className="w-64 sm:w-80">
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
                fontSize="36"
                fontFamily="Inter, sans-serif"
                fontWeight="900"
                fill="url(#tricolorGradientLogin)"
                stroke="#1e293b"
                strokeWidth="0.5"
                letterSpacing="2"
            >
                UNIFIED
            </text>
        </svg>
    </div>
);

const LocationSetup: React.FC<{ onLocationSet: (location: LocationData) => void }> = ({ onLocationSet }) => {
    const [district, setDistrict] = useState('');
    const districts = INDIAN_STATES["Tamil Nadu"];

    const handleConfirm = () => {
        if (district) {
            const coords = LOCATION_COORDS[district] || { lat: 13.0827, lng: 80.2707 };
            onLocationSet({ country: 'India', state: 'Tamil Nadu', district, coords });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 space-y-8 animate-fadeInUp">
            <div className="text-center">
                <TricolorLogo size="sm" />
                <h2 className="text-2xl font-bold text-slate-800 mt-4">Select Your City</h2>
                <p className="text-slate-500 mt-2 text-sm font-medium">Smart City Administration Node</p>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location District</label>
                <select 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)} 
                    className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-semibold text-slate-700 appearance-none shadow-sm"
                >
                    <option value="">Select your city</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <button
                onClick={handleConfirm}
                disabled={!district}
                className="w-full py-4 px-4 text-white font-black rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transform hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
                Confirm & Continue
            </button>
        </div>
    );
};

type View = 'selection' | 'citizen' | 'government';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGovLogin, onRegister }) => {
    const [view, setView] = useState<View>('selection');
    const [step, setStep] = useState(1);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [password, setPassword] = useState('');
    const [govEmail, setGovEmail] = useState('');
    const [govPassword, setGovPassword] = useState('');

    const inputClasses = "w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-slate-800";

    const handleCitizenSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authMode === 'login') onLogin(phone, password);
        else setStep(2);
    };

    if (step === 2) return (
        <div className="h-full w-full grid place-items-center bg-white p-4">
            <LocationSetup onLocationSet={(l) => onRegister({ name, phone, aadhaar, password, location: l })} />
        </div>
    );

    return (
        <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-50 to-transparent pointer-events-none opacity-50"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-30"></div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
                {view === 'selection' ? (
                    <div className="w-full max-sm text-center space-y-12 animate-scaleIn">
                        <div className="space-y-3">
                            <TricolorLogo />
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Smart Infrastructure Platform</p>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => setView('citizen')} 
                                className="w-full py-5 bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center group hover:border-teal-500 transition-all active:scale-95"
                            >
                                <span className="text-lg font-black text-slate-800">Citizen Hub</span>
                                <span className="text-xs font-bold text-teal-600 mt-1 uppercase tracking-widest">Access Services</span>
                            </button>

                            <button 
                                onClick={() => setView('government')} 
                                className="w-full py-5 bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/30 flex flex-col items-center transform hover:bg-slate-800 transition-all active:scale-95"
                            >
                                <span className="text-lg font-black text-white tracking-wide">Official Portal</span>
                                <span className="text-xs font-bold text-teal-400 mt-1 uppercase tracking-widest">Government Login</span>
                            </button>
                        </div>

                        <p className="text-slate-400 text-xs font-semibold leading-relaxed px-8">
                            A secure Digital India platform for connecting citizens with government services in real-time.
                        </p>
                    </div>
                ) : view === 'citizen' ? (
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 w-full max-w-sm relative animate-fadeInUp border border-slate-100">
                        <button onClick={() => setView('selection')} className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"><ArrowLeftIcon/></button>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">Welcome Back</h2>
                            <p className="text-slate-500 text-sm font-semibold mt-1">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleCitizenSubmit} className="space-y-4">
                            {authMode === 'signup' && <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} />}
                            <input type="tel" placeholder="Mobile Number" value={phone} onChange={e => setPhone(e.target.value)} required className={inputClasses} />
                            {authMode === 'signup' && <input type="text" placeholder="Aadhaar Number" value={aadhaar} onChange={e => setAadhaar(e.target.value)} required className={inputClasses} />}
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className={inputClasses} />
                            
                            <button type="submit" className="w-full py-4 bg-teal-600 text-white font-black rounded-2xl shadow-lg shadow-teal-200 transform hover:scale-[1.02] active:scale-95 transition-all mt-4">
                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                        
                        <button 
                            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} 
                            className="w-full text-center mt-6 text-sm text-slate-500 font-bold hover:text-teal-600 transition-colors"
                        >
                            {authMode === 'login' ? (
                                <span>Don't have an account? <span className="text-teal-600 underline">Sign Up</span></span>
                            ) : (
                                <span>Already have an account? <span className="text-teal-600 underline">Login</span></span>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 w-full max-w-sm text-white relative animate-fadeInUp">
                        <button onClick={() => setView('selection')} className="absolute top-6 left-6 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all"><ArrowLeftIcon/></button>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-white tracking-wide uppercase">Command Center</h2>
                            <p className="text-slate-400 text-xs font-bold mt-1 tracking-widest italic">Government Authorization Required</p>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); onGovLogin(govEmail, govPassword); }} className="space-y-4">
                            <input type="email" placeholder="Official ID" value={govEmail} onChange={e => setGovEmail(e.target.value)} required className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium text-white" />
                            <input type="password" placeholder="Access Code" value={govPassword} onChange={e => setGovPassword(e.target.value)} required className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium text-white" />
                            <button type="submit" className="w-full py-4 bg-teal-600 text-white font-black rounded-2xl shadow-xl shadow-teal-900/50 transform hover:scale-[1.02] active:scale-95 transition-all mt-4">
                                Verify Access
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <p className="text-center p-6 text-slate-400 text-[10px] font-black uppercase tracking-widest z-10">
                Official Government of India Platform
            </p>
        </div>
    );
};

export default LoginPage;