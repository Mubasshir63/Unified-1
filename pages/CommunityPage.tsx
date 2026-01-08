import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { useTranslation } from '../hooks/useTranslation';
import { 
    PotholeIcon, WasteTrackerIcon, StreetlightIcon, WaterLeakIcon, ParkingIcon, OtherIcon, CameraIcon, ArrowLeftIcon, CheckCircleIcon, MagnifyingGlassIcon, UserCircleIcon, TrafficSignalIcon, PublicTransportIcon, NoisePollutionIcon, VideoCameraIcon, AiAssistantIcon 
} from '../components/icons/NavIcons';
import { Page } from '../types';
import ReportConfirmationModal from '../components/ReportConfirmationModal';
import { GoogleGenAI } from "@google/genai";

declare const L: any;

type ViewState = 'category' | 'form' | 'confirmed' | 'submitted';

interface ReportPageProps {
    onAddNewReport: (reportData: {
        title: string;
        category: string;
        description: string;
        photo: string | null;
        video: string | null;
        coords: { lat: number; lng: number };
    }) => Promise<void>;
}

const colorClasses = {
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', shadow: 'hover:shadow-slate-400/30' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', shadow: 'hover:shadow-amber-400/30' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', shadow: 'hover:shadow-orange-400/30' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-600', shadow: 'hover:shadow-sky-400/30' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', shadow: 'hover:shadow-indigo-400/30' },
    red: { bg: 'bg-red-100', text: 'text-red-600', shadow: 'hover:shadow-red-400/30' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', shadow: 'hover:shadow-purple-400/30' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', shadow: 'hover:shadow-pink-400/30' },
};

const CategoryCard: React.FC<{ name: string; icon: React.ReactNode; onSelect: () => void; color: keyof typeof colorClasses }> = ({ name, icon, onSelect, color }) => {
    const classes = colorClasses[color] || colorClasses.slate;
    return (
        <button 
            onClick={onSelect} 
            className={`group bg-white rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 transform hover:-translate-y-1 ${classes.shadow} transition-all duration-300 w-full aspect-square`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${classes.bg} ${classes.text} transition-colors duration-300`}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
            </div>
            <h3 className="font-bold text-gray-800 text-sm mt-4 leading-tight uppercase tracking-tight">{name}</h3>
        </button>
    );
};

const ReportPage: React.FC<ReportPageProps> = ({ onAddNewReport }) => {
    const { user } = useContext(UserContext);
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [view, setView] = useState<ViewState>('category');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [video, setVideo] = useState<string | null>(null);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportId, setReportId] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    
    const reportCategories: { key: string; name: string; icon: React.ReactNode; color: keyof typeof colorClasses }[] = [
      { key: 'pothole', name: t('pothole'), icon: <PotholeIcon />, color: 'slate' },
      { key: 'garbage', name: t('garbage'), icon: <WasteTrackerIcon />, color: 'amber' },
      { key: 'streetlight', name: t('streetlight'), icon: <StreetlightIcon />, color: 'orange' },
      { key: 'waterLeak', name: t('waterLeak'), icon: <WaterLeakIcon />, color: 'sky' },
      { key: 'parking', name: t('parking'), icon: <ParkingIcon />, color: 'indigo' },
      { key: 'trafficSignal', name: t('trafficSignal'), icon: <TrafficSignalIcon />, color: 'red' },
      { key: 'publicTransport', name: t('publicTransport'), icon: <PublicTransportIcon />, color: 'purple' },
      { key: 'noisePollution', name: t('noisePollution'), icon: <NoisePollutionIcon />, color: 'pink' },
      { key: 'other', name: t('other'), icon: <OtherIcon />, color: 'slate' },
    ];

    useEffect(() => {
        if (!location) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setLocation(user?.location.coords || { lat: 13.0827, lng: 80.2707 })
            );
        }
    }, [user]);

    useEffect(() => {
        if (view === 'form' && location && mapContainerRef.current && !mapRef.current) {
            const m = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([location.lat, location.lng], 16);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(m);
            L.marker([location.lat, location.lng]).addTo(m);
            mapRef.current = m;
            setTimeout(() => m.invalidateSize(), 100);
        }
    }, [view, location]);

    const handleSelectCategory = (name: string) => {
        setSelectedCategory(name);
        setView('form');
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmation(false);
        setIsSubmitting(true);
        const newId = Math.random().toString(36).substring(7).toUpperCase();
        setReportId(newId);
        
        if (selectedCategory && location) {
            await onAddNewReport({
                title: `Report: ${selectedCategory}`,
                category: selectedCategory,
                description,
                photo,
                video,
                coords: location
            });
        }
        setIsSubmitting(false);
        setView('submitted');
    };

    const handleReset = () => {
        setView('category');
        setSelectedCategory(null);
        setDescription('');
        setPhoto(null);
        setVideo(null);
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };

    if (view === 'submitted') {
        return (
            <div className="p-6 bg-white min-h-full flex flex-col items-center justify-center text-center animate-fadeInUp">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircleIcon className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('reportSubmitted')}</h1>
                <p className="text-gray-500 mt-2 font-medium">{t('reportReceived', { category: selectedCategory || '' })}</p>
                <div className="mt-4 px-4 py-1.5 bg-slate-100 rounded-full font-mono text-xs font-bold text-slate-500 tracking-widest">{t('refId', { id: reportId })}</div>
                <div className="w-full max-w-sm mt-12 space-y-4 text-left">
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[10px] ml-1">{t('whatHappensNext')}</h3>
                    {[
                        { title: t('underReviewTitle'), desc: t('underReviewDesc'), icon: <MagnifyingGlassIcon /> },
                        { title: t('assignedTitle'), desc: t('assignedDesc'), icon: <UserCircleIcon /> },
                        { title: t('resolutionTitle'), desc: t('resolutionDesc'), icon: <CheckCircleIcon /> },
                    ].map((step, i) => (
                        <div key={i} className="flex space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 flex-shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600">{step.icon}</div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm leading-none mb-1">{step.title}</h4>
                                <p className="text-xs text-gray-500 font-medium">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleReset} className="mt-10 w-full max-w-xs py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">{t('fileAnotherReport')}</button>
            </div>
        );
    }

    if (view === 'form') {
        return (
            <div className="p-6 bg-slate-50 min-h-full animate-fadeInUp">
                <header className="flex items-center mb-8">
                    <button onClick={() => setView('category')} className="p-3 mr-4 -ml-3 bg-white rounded-full shadow-sm text-slate-600"><ArrowLeftIcon /></button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('reportTitle', { category: selectedCategory || '' })}</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t('provideDetails')}</p>
                    </div>
                </header>

                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-1">{t('description')}</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder={t('descriptionPlaceholder')} 
                            className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-teal-500 outline-none text-sm font-semibold transition-all min-h-[120px]"
                        />
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-1">{t('location')}</label>
                        <div ref={mapContainerRef} className="h-40 w-full rounded-2xl bg-slate-100 z-0 border border-slate-100" />
                        <p className="mt-3 text-[10px] text-slate-400 font-bold flex items-center px-1"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>{t('locationGps')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => fileInputRef.current?.click()} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-500 hover:text-teal-600 transition-colors">
                            {photo ? <img src={photo} className="w-full h-full object-cover rounded-xl" /> : <><CameraIcon className="w-8 h-8 mb-2" /><span className="text-[10px] font-black uppercase tracking-widest">Photo Attachment</span></>}
                        </button>
                         <button className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-slate-500 hover:text-rose-500 transition-colors">
                            <VideoCameraIcon className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Video Report</span>
                        </button>
                    </div>

                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={e => {
                        const file = e.target.files?.[0];
                        if(file) {
                            const r = new FileReader();
                            r.onloadend = () => setPhoto(r.result as string);
                            r.readAsDataURL(file);
                        }
                    }} />

                    <button 
                        onClick={() => setShowConfirmation(true)}
                        disabled={!description.trim()}
                        className="w-full py-4 bg-teal-600 text-white font-black rounded-2xl shadow-xl hover:bg-teal-700 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
                    >
                        {t('submitReport')}
                    </button>
                </div>

                {showConfirmation && (
                    <ReportConfirmationModal 
                        category={selectedCategory!} description={description} photo={photo} video={null} location={location!}
                        onConfirm={handleConfirmSubmit} onCancel={() => setShowConfirmation(false)}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="p-6 bg-white min-h-full animate-fadeInUp">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight uppercase">{t('fileNewReport')}</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{t('selectCategory')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {reportCategories.map((cat) => (
                    <CategoryCard key={cat.key} {...cat} onSelect={() => handleSelectCategory(cat.name)} />
                ))}
            </div>
        </div>
    );
};

export default ReportPage;