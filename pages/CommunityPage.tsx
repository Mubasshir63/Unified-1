

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
    red: { bg: 'bg-red-100', text: 'text-red-600', hoverBg: 'group-hover:bg-red-200', shadow: 'hover:shadow-red-400/50' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', hoverBg: 'group-hover:bg-orange-200', shadow: 'hover:shadow-orange-400/50' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-200', shadow: 'hover:shadow-amber-400/50' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-200', shadow: 'hover:shadow-blue-400/50' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hoverBg: 'group-hover:bg-indigo-200', shadow: 'hover:shadow-indigo-400/50' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-200', shadow: 'hover:shadow-purple-400/50' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600', hoverBg: 'group-hover:bg-pink-200', shadow: 'hover:shadow-pink-400/50' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', hoverBg: 'group-hover:bg-slate-200', shadow: 'hover:shadow-slate-400/50' },
    sky: { bg: 'bg-sky-100', text: 'text-sky-600', hoverBg: 'group-hover:bg-sky-200', shadow: 'hover:shadow-sky-400/50' },
};


type CategoryColor = keyof typeof colorClasses;

const CategoryCard: React.FC<{ name: string; icon: React.ReactNode; onSelect: () => void; color: CategoryColor }> = ({ name, icon, onSelect, color }) => {
    const classes = colorClasses[color] || colorClasses.slate;

    return (
        <button 
            onClick={onSelect} 
            className={`group bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg border border-gray-200/50 transform hover:-translate-y-1.5 ${classes.shadow} transition-all duration-300 w-full aspect-[4/5] tilt-card`}
        >
            <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center ${classes.bg} ${classes.text} ${classes.hoverBg} transition-all duration-300`}>
                {icon}
            </div>
            <h3 className="font-bold text-gray-800 text-md mt-4 leading-tight flex-1 flex items-center">{name}</h3>
        </button>
    );
};

// Sub-components moved outside the main component to prevent re-mounting on every render.

const CategorySelectionView: React.FC<{
    t: (key: string) => string;
    reportCategories: { key: string; name: string; icon: React.ReactNode; color: CategoryColor }[];
    handleSelectCategory: (name: string) => void;
}> = ({ t, reportCategories, handleSelectCategory }) => (
    <div className="p-4 bg-gradient-to-b from-white to-gray-100 min-h-full">
        <div className="pb-6 animate-fadeInUp">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('fileNewReport')}</h1>
            <p className="text-gray-600 text-lg mt-1">{t('selectCategory')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {reportCategories.map((cat, i) => (
                <div key={cat.key} className="animate-fadeInUp" style={{animationDelay: `${i * 50}ms`}}>
                    <CategoryCard {...cat} onSelect={() => handleSelectCategory(cat.name)} />
                </div>
            ))}
        </div>
    </div>
);

const ReportFormView: React.FC<{
    t: (key: any, params?: any) => string;
    setView: (view: ViewState) => void;
    selectedCategory: string | null;
    handleSubmit: (e: React.FormEvent) => void;
    description: string;
    setDescription: (desc: string) => void;
    photo: string | null;
    video: string | null;
    fileInputRef: React.RefObject<HTMLInputElement>;
    videoInputRef: React.RefObject<HTMLInputElement>;
    handleTakePhoto: () => void;
    handleUploadVideo: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleVideoFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    mapContainerRef: React.RefObject<HTMLDivElement>;
    location: { lat: number; lng: number } | null;
    isSubmitting: boolean;
    handleSuggestCategory: () => void;
    isSuggesting: boolean;
}> = ({
    t, setView, selectedCategory, handleSubmit, description, setDescription,
    photo, video, fileInputRef, videoInputRef, handleTakePhoto, handleUploadVideo,
    handleFileChange, handleVideoFileChange, mapContainerRef, location, isSubmitting,
    handleSuggestCategory, isSuggesting
}) => (
    <div className="p-4 bg-gray-50 min-h-full">
        <header className="flex items-center mb-6">
            <button onClick={() => setView('category')} className="p-2 mr-2 -ml-2 text-gray-600 hover:bg-gray-200 rounded-full">
                <ArrowLeftIcon />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{t('reportTitle', { category: selectedCategory || '' })}</h1>
                <p className="text-sm text-gray-500">{t('provideDetails')}</p>
            </div>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Attachments (Optional)</label>
                <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoFileChange} className="hidden" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {photo ? (
                        <div className="relative group animate-scaleIn">
                            <img src={photo} alt="Report preview" className="w-full h-48 object-cover rounded-xl" />
                            <button type="button" onClick={handleTakePhoto} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                {t('retakePhoto')}
                            </button>
                        </div>
                    ) : (
                         <button type="button" onClick={handleTakePhoto} className="w-full h-32 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-600 hover:bg-green-50 hover:text-green-600 border-2 border-transparent hover:border-green-200 transition-all transform hover:scale-105">
                            <CameraIcon />
                            <span className="mt-2 text-sm font-semibold">{t('takePhoto')}</span>
                        </button>
                    )}
                    
                    {video ? (
                        <div className="relative group animate-scaleIn">
                            <video src={video} controls className="w-full h-48 object-cover rounded-xl bg-black"></video>
                            <button type="button" onClick={handleUploadVideo} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                Change Video
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={handleUploadVideo} className="w-full h-32 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-600 hover:bg-teal-50 hover:text-teal-600 border-2 border-transparent hover:border-teal-200 transition-all transform hover:scale-105">
                            <VideoCameraIcon />
                            <span className="mt-2 text-sm font-semibold">Upload Video</span>
                        </button>
                    )}
                </div>
            </div>
            
            <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">{t('description')}</label>
                <textarea 
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('descriptionPlaceholder')}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                 <button type="button" onClick={handleSuggestCategory} disabled={isSuggesting || description.length < 10} className="mt-2 flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full hover:bg-teal-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <AiAssistantIcon className="w-4 h-4"/>
                    <span>{isSuggesting ? 'Analyzing...' : 'Suggest Category'}</span>
                </button>
            </div>
            
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">{t('location')}</label>
                <div ref={mapContainerRef} className="h-40 w-full rounded-xl z-0" id="report-map"></div>
                {location && <p className="text-xs text-gray-500 mt-2">{t('locationGps')}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform shadow-lg">
                {isSubmitting ? t('submitting') : t('submitReport')}
            </button>
        </form>
    </div>
);

const SubmittedView: React.FC<{
    t: (key: any, params?: any) => string;
    selectedCategory: string | null;
    reportId: string;
    handleReset: () => void;
}> = ({ t, selectedCategory, reportId, handleReset }) => (
    <div className="p-4 bg-gray-50 min-h-full flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <div className="mb-4 inline-block">
                <svg className="animated-checkmark" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="11" fill="#ecfdf5"/>
                    <path className="animated-checkmark__check" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7"/>
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t('reportSubmitted')}</h1>
            <p className="text-gray-600 mt-2">{t('reportReceived', { category: selectedCategory || '' })}</p>
            <p className="text-sm text-gray-500 mt-1">{t('refId', { id: reportId })}</p>

            <div className="text-left mt-8 space-y-4">
                <h2 className="font-bold text-lg text-gray-800 mb-3">{t('whatHappensNext')}</h2>
                
                <div className="flex items-start space-x-4">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><MagnifyingGlassIcon/></div>
                     <div>
                         <h3 className="font-semibold text-gray-800">{t('underReviewTitle')}</h3>
                         <p className="text-sm text-gray-600">{t('underReviewDesc')}</p>
                     </div>
                </div>

                <div className="flex items-start space-x-4">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><UserCircleIcon/></div>
                     <div>
                         <h3 className="font-semibold text-gray-800">{t('assignedTitle')}</h3>
                         <p className="text-sm text-gray-600">{t('assignedDesc')}</p>
                     </div>
                </div>

                <div className="flex items-start space-x-4">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><CheckCircleIcon/></div>
                     <div>
                         <h3 className="font-semibold text-gray-800">{t('resolutionTitle')}</h3>
                         <p className="text-sm text-gray-600">{t('resolutionDesc')}</p>
                     </div>
                </div>
            </div>

            <div className="mt-8 space-y-3">
                <button onClick={handleReset} className="w-full py-3 px-4 text-gray-700 font-semibold rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors">
                    {t('fileAnotherReport')}
                </button>
            </div>
        </div>
    </div>
);

const ConfirmationAnimationView: React.FC<{ t: (key: string) => string; setView: (v: ViewState) => void }> = ({ t, setView }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            setView('submitted');
        }, 2500); // Animation duration
        return () => clearTimeout(timer);
    }, [setView]);

    return (
        <div className="fixed inset-0 bg-green-600 z-50 flex flex-col items-center justify-center text-white animate-gpay-bg-fade-in">
            <svg className="gpay-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="gpay-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="gpay-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h1 className="gpay-text">{t('reportSubmitted')}</h1>
        </div>
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
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [reportId, setReportId] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    
    const reportCategories: { key: string; name: string; icon: React.ReactNode; color: CategoryColor }[] = [
      { key: 'pothole', name: t('pothole'), icon: <PotholeIcon className="w-10 h-10" />, color: 'slate' },
      { key: 'garbage', name: t('garbage'), icon: <WasteTrackerIcon className="w-10 h-10" />, color: 'amber' },
      { key: 'streetlight', name: t('streetlight'), icon: <StreetlightIcon className="w-10 h-10" />, color: 'orange' },
      { key: 'waterLeak', name: t('waterLeak'), icon: <WaterLeakIcon className="w-10 h-10" />, color: 'sky' },
      { key: 'parking', name: t('parking'), icon: <ParkingIcon className="w-10 h-10" />, color: 'indigo' },
      { key: 'trafficSignal', name: t('trafficSignal'), icon: <TrafficSignalIcon className="w-10 h-10" />, color: 'red' },
      { key: 'publicTransport', name: t('publicTransport'), icon: <PublicTransportIcon className="w-10 h-10" />, color: 'purple' },
      { key: 'noisePollution', name: t('noisePollution'), icon: <NoisePollutionIcon className="w-10 h-10" />, color: 'pink' },
      { key: 'other', name: t('other'), icon: <OtherIcon className="w-10 h-10" />, color: 'slate' },
    ];

    const categoryNames = reportCategories.map(c => c.name);

    useEffect(() => {
        const prefilledDataString = sessionStorage.getItem('prefilledReportData');
        if (prefilledDataString) {
            try {
                const data = JSON.parse(prefilledDataString);
                if (data.category && data.coords) {
                    setSelectedCategory(data.category);
                    setView('form');
                    setLocation(data.coords);
                }
            } catch (e) {
                console.error("Failed to parse prefilled report data", e);
            } finally {
                sessionStorage.removeItem('prefilledReportData');
            }
        } else {
             navigator.geolocation.getCurrentPosition(
                (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
                () => user?.location.coords && setLocation(user.location.coords)
            );
        }
    }, [user]);
    
    useEffect(() => {
        if (view === 'form' && location && mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([location.lat, location.lng], 18);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            const marker = L.marker([location.lat, location.lng], { draggable: true }).addTo(map);
            marker.on('dragend', (e: any) => {
                const { lat, lng } = e.target.getLatLng();
                setLocation({ lat, lng });
            });
            
            markerRef.current = marker;
            mapRef.current = map;
            setTimeout(() => map.invalidateSize(), 400); // After slide animation
        }
    }, [view, location]);

    const handleTakePhoto = () => fileInputRef.current?.click();
    const handleUploadVideo = () => videoInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                showToast("Video file exceeds 50MB limit.");
                event.target.value = ''; // Reset file input
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setVideo(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmation(false);
        setIsSubmitting(true);
        const newReportId = Math.random().toString(36).substring(2, 9).toUpperCase();
        setReportId(newReportId);
        
        if (selectedCategory && location) {
            await onAddNewReport({
                title: `Reported: ${selectedCategory}`,
                category: selectedCategory,
                description,
                photo,
                video,
                coords: location
            });
        }
        setIsSubmitting(false);
        setView('confirmed');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description) {
            showToast(t('pleaseProvideDescription'));
            return;
        }
        setShowConfirmation(true);
    };

    const handleReset = () => {
        setView('category');
        setTimeout(() => {
             setSelectedCategory(null);
             setDescription('');
             setPhoto(null);
             setVideo(null);
             setReportId('');
             if (mapRef.current) {
                 mapRef.current.remove();
                 mapRef.current = null;
             }
        }, 400); // Allow animation to complete
    };
    
    const handleSelectCategory = (name: string) => {
        setSelectedCategory(name);
        setView('form');
    };

    const handleSuggestCategory = async () => {
        if (description.length < 10) {
            showToast("Please provide more details in the description.");
            return;
        }
        setIsSuggesting(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Given the report description: "${description}", which of these categories is most appropriate? Categories: ${categoryNames.join(', ')}. Respond with ONLY the most appropriate category name from the list.`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            const suggestedCategory = response.text.trim();
            if (categoryNames.includes(suggestedCategory)) {
                setSelectedCategory(suggestedCategory);
                showToast(`Suggested category: ${suggestedCategory}`);
            } else {
                showToast("Could not determine a category. Please select one manually.");
            }
        } catch (error) {
            console.error("Gemini category suggestion error:", error);
            showToast("Error suggesting category. Please select one manually.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const categoryClass = view === 'category' ? 'translate-x-0' : '-translate-x-full';
    const formClass = view === 'form' || view === 'confirmed' ? 'translate-x-0' : view === 'category' ? 'translate-x-full' : '-translate-x-full';
    const submittedClass = view === 'submitted' ? 'translate-x-0' : 'translate-x-full';

    return (
        <div className="relative w-full h-full overflow-hidden">
            {view === 'confirmed' && <ConfirmationAnimationView t={t} setView={setView} />}

            <div className={`w-full h-full absolute transition-transform duration-400 ease-in-out overflow-y-auto ${categoryClass}`}>
                <CategorySelectionView 
                    t={t}
                    reportCategories={reportCategories}
                    handleSelectCategory={handleSelectCategory}
                />
            </div>
            <div className={`w-full h-full absolute transition-transform duration-400 ease-in-out overflow-y-auto ${formClass}`}>
                {selectedCategory && (
                    <ReportFormView 
                        t={t}
                        setView={setView}
                        selectedCategory={selectedCategory}
                        handleSubmit={handleSubmit}
                        description={description}
                        setDescription={setDescription}
                        photo={photo}
                        video={video}
                        fileInputRef={fileInputRef}
                        videoInputRef={videoInputRef}
                        handleTakePhoto={handleTakePhoto}
                        handleUploadVideo={handleUploadVideo}
                        handleFileChange={handleFileChange}
                        handleVideoFileChange={handleVideoFileChange}
                        mapContainerRef={mapContainerRef}
                        location={location}
                        isSubmitting={isSubmitting}
                        handleSuggestCategory={handleSuggestCategory}
                        isSuggesting={isSuggesting}
                    />
                )}
            </div>
            <div className={`w-full h-full absolute transition-transform duration-400 ease-in-out overflow-y-auto ${submittedClass}`}>
                {view === 'submitted' && (
                    <SubmittedView 
                        t={t}
                        selectedCategory={selectedCategory}
                        reportId={reportId}
                        handleReset={handleReset}
                    />
                )}
            </div>
            
            {showConfirmation && location && (
                <ReportConfirmationModal
                    category={selectedCategory!}
                    description={description}
                    photo={photo}
                    video={video}
                    location={location}
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
};

export default ReportPage;