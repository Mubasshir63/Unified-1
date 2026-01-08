
import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { DocumentTextIcon, SearchIcon, LocationMarkerIcon } from '../../components/icons/NavIcons';
import { INDIAN_STATES } from '../../constants';

const LandRecordsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { showToast } = useNotifications();
    const [district, setDistrict] = useState('');
    const [surveyNo, setSurveyNo] = useState('');
    const [searching, setSearching] = useState(false);
    const [result, setResult] = useState<any>(null);

    const districts = INDIAN_STATES["Tamil Nadu"];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearching(true);
        setResult(null);
        setTimeout(() => {
            setResult({
                pattaNo: '852',
                owner: 'S. Mohamed Hisham',
                extent: '0.45 Hectares',
                landType: 'Dry Land (Punjai)',
                location: `${district} District, Taluk No. 4`
            });
            setSearching(false);
        }, 2000);
    };

    return (
        <ServicePageLayout title="Land Records" subtitle="Anytime Anywhere e-Services (Patta/Chitta)" onBack={onBack}>
            <div className="max-w-md mx-auto space-y-6">
                <form onSubmit={handleSearch} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-800 mb-2">View Patta & Chitta</h3>
                    <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none" required>
                        <option value="">Select District</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input 
                        type="text" 
                        placeholder="Survey Number (e.g. 145/2A)" 
                        value={surveyNo} 
                        onChange={e => setSurveyNo(e.target.value)} 
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                        required
                    />
                    <button type="submit" disabled={searching} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg transition-all flex justify-center items-center">
                        {searching ? <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'Search Records'}
                    </button>
                </form>

                {result && (
                    <div className="bg-white rounded-3xl border-2 border-blue-50 overflow-hidden animate-scaleIn shadow-2xl">
                         <div className="p-5 border-b bg-blue-50/50 flex items-center justify-between">
                            <h4 className="font-black text-blue-900 tracking-tight">Record Found</h4>
                            <span className="px-3 py-1 bg-white text-blue-600 text-xs font-bold rounded-full border border-blue-100 shadow-sm">AUTHENTICATED</span>
                         </div>
                         <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Owner Name</span><span className="font-bold text-gray-800">{result.owner}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Patta No.</span><span className="font-mono font-bold text-gray-800">{result.pattaNo}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-400 text-sm">Land Extent</span><span className="font-bold text-gray-800">{result.extent}</span></div>
                            <div className="flex justify-between items-center border-t pt-3"><span className="text-gray-400 text-sm">Land Classification</span><span className="font-bold text-teal-600">{result.landType}</span></div>
                         </div>
                         <div className="p-4 bg-gray-50 flex gap-2">
                            <button onClick={() => showToast("Downloading Digitally Signed Patta...")} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">Download PDF</button>
                            <button onClick={() => showToast("Forwarding to Taluk Office...")} className="flex-1 py-3 bg-blue-600 rounded-xl text-xs font-bold text-white shadow-md hover:bg-blue-700">Apply Correction</button>
                         </div>
                    </div>
                )}
            </div>
        </ServicePageLayout>
    );
};

export default LandRecordsPage;
