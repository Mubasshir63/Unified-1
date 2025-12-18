
import React, { useState, useRef, useContext, useEffect } from 'react';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { UserContext } from '../../contexts/UserContext';
import { GoogleGenAI } from "@google/genai";
import { ShieldCheckIcon, ExclamationTriangleIcon, LockClosedIcon, PhoneIcon, FingerPrintIcon, CameraIcon, ShieldIcon, CheckCircleIcon, SearchIcon, UserCircleIcon } from '../../components/icons/NavIcons';
import { CyberCategory, ThreatLevel, InterceptedMessage, UrlScanResult, BreachResult } from '../../types';
import * as mockApi from '../../api/mockApi';

interface CyberSafetyPageProps {
  onBack: () => void;
}

const InterceptModal: React.FC<{ message: InterceptedMessage; onClose: () => void; onReport: () => void }> = ({ message, onClose, onReport }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[70] flex flex-col items-center justify-center p-4 animate-scaleIn">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-red-500">
                <div className="bg-red-600 p-4 text-white flex items-center justify-between">
                     <div className="flex items-center">
                         <ExclamationTriangleIcon className="w-8 h-8 mr-3 animate-pulse" />
                         <div>
                             <h3 className="font-bold text-lg">Threat Intercepted</h3>
                             <p className="text-xs opacity-90">Unified Background Guard</p>
                         </div>
                     </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg border-l-4 border-red-500">
                        <p className="text-xs font-bold text-gray-500 mb-1">{message.platform} • {message.sender}</p>
                        <p className="font-mono text-sm text-gray-800 break-words">
                            {message.content}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Detected Risk:</span>
                        <span className="font-bold text-red-600 px-2 py-1 bg-red-100 rounded">{message.detectedCategory}</span>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button onClick={onReport} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md flex items-center justify-center transition-transform transform active:scale-95">
                            <LockClosedIcon className="w-5 h-5 mr-2" /> Report to Cyber Cell
                        </button>
                        <button onClick={onClose} className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors">
                            Ignore & Dismiss
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-gray-400 mt-2">
                        By reporting, you consent to sharing this message content with law enforcement for investigation.
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Background Animation Component ---
const BackgroundRadar: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <style>{`
            @keyframes radar-scan {
                0% { top: -10%; opacity: 0; }
                15% { opacity: 1; }
                85% { opacity: 1; }
                100% { top: 110%; opacity: 0; }
            }
            @keyframes radar-ripple {
                0% { transform: scale(0.5); opacity: 0.6; border-width: 4px; }
                100% { transform: scale(2.5); opacity: 0; border-width: 0px; }
            }
            .radar-grid {
                background-image: linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
                background-size: 40px 40px;
            }
        `}</style>
        
        {/* Grid Background */}
        <div className="absolute inset-0 radar-grid opacity-30"></div>
        
        {/* Scanning Line */}
        <div className="absolute left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-[radar-scan_3s_linear_infinite]"></div>
        
        {/* Pulse Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-[300px] h-[300px] rounded-full border border-emerald-500/40 animate-[radar-ripple_3s_linear_infinite]"></div>
             <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full border border-emerald-500/40 animate-[radar-ripple_3s_linear_infinite] delay-1000"></div>
        </div>
        
        {/* Radial Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-900/80"></div>
    </div>
);

// --- SUB-COMPONENTS for Tabs ---

const ManualAnalyzer: React.FC<{ 
    inputText: string; setInputText: (t: string) => void; 
    screenshot: string | null; setScreenshot: (s: string | null) => void; 
    isAnalyzing: boolean; handleAnalyze: () => void; 
    analysisResult: any; handleReport: () => void; 
    setAnalysisResult: (r: any) => void;
}> = ({ inputText, setInputText, screenshot, setScreenshot, isAnalyzing, handleAnalyze, analysisResult, handleReport, setAnalysisResult }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setScreenshot(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6 animate-fadeInUp">
             <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <FingerPrintIcon className="w-5 h-5 mr-2 text-blue-600"/>
                    Text / Image Analysis
                </h3>
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Paste suspicious text, link, or message here..." className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] text-sm mb-4" />
                <div className="flex space-x-3 mb-4">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-400 transition-all">
                        {screenshot ? <img src={screenshot} className="h-8 w-auto object-contain" alt="upload" /> : <><CameraIcon className="w-6 h-6 mb-1" /><span className="text-xs">Upload Screenshot</span></>}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleScreenshotUpload} />
                </div>
                <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:bg-gray-400 flex justify-center items-center">
                    {isAnalyzing ? <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>Analyzing...</span> : 'Analyze for Threats'}
                </button>
            </div>

            {analysisResult && (
                <div className={`p-5 rounded-2xl border-2 animate-scaleIn ${analysisResult.level === 'Safe' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className={`text-lg font-bold ${analysisResult.level === 'Safe' ? 'text-green-800' : 'text-red-800'}`}>{analysisResult.level === 'Safe' ? 'No Threat Detected' : 'Potential Threat Detected'}</h4>
                            <p className="text-sm font-medium opacity-75">{analysisResult.category} • {analysisResult.level} Risk</p>
                        </div>
                        {analysisResult.level !== 'Safe' ? <ExclamationTriangleIcon className="w-8 h-8 text-red-500" /> : <CheckCircleIcon className="w-8 h-8 text-green-500" />}
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg mb-4 text-sm font-medium">AI Advice: "{analysisResult.advice}"</div>
                    {analysisResult.level !== 'Safe' ? (
                        <button onClick={handleReport} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-md flex items-center justify-center"><LockClosedIcon className="w-5 h-5 mr-2" /> Report to Cyber Cell</button>
                    ) : (
                        <button onClick={() => setAnalysisResult(null)} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md">Scan Another Message</button>
                    )}
                </div>
            )}
        </div>
    );
};

const UrlScanner: React.FC = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<UrlScanResult | null>(null);
    const [scanning, setScanning] = useState(false);

    const handleScan = async () => {
        if (!url) return;
        setScanning(true);
        setResult(null);
        const res = await mockApi.scanUrl(url);
        setResult(res);
        setScanning(false);
    };

    return (
        <div className="space-y-6 animate-fadeInUp">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><SearchIcon className="w-5 h-5 mr-2 text-teal-600"/>Link Safety Scanner</h3>
                <div className="flex space-x-2 mb-4">
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste URL to check (e.g., http://...)" className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm" />
                    <button onClick={handleScan} disabled={scanning || !url} className="bg-teal-600 text-white px-4 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50">{scanning ? '...' : 'Scan'}</button>
                </div>
                {result && (
                    <div className={`p-4 rounded-xl border ${result.isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} animate-scaleIn`}>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${result.isSafe ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                {result.isSafe ? <CheckCircleIcon /> : <ExclamationTriangleIcon />}
                            </div>
                            <div>
                                <h4 className={`font-bold ${result.isSafe ? 'text-green-800' : 'text-red-800'}`}>{result.isSafe ? 'Safe Link' : 'Malicious Link Detected'}</h4>
                                {!result.isSafe && <p className="text-xs font-bold text-red-600 uppercase">{result.threatType}</p>}
                            </div>
                        </div>
                        <div className="mt-3 space-y-2 text-sm">
                            <p><strong>Risk Score:</strong> {result.riskScore}/100</p>
                            <p><strong>Host Location:</strong> {result.hostLocation}</p>
                            <p className="bg-white/50 p-2 rounded"><strong>Analysis:</strong> {result.analysis}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const IdentityCheck: React.FC = () => {
    const { user } = useContext(UserContext);
    const [breaches, setBreaches] = useState<BreachResult[] | null>(null);
    const [checking, setChecking] = useState(false);

    const handleCheck = async () => {
        setChecking(true);
        const res = await mockApi.checkDataBreach(user?.email || 'test');
        setBreaches(res);
        setChecking(false);
    };

    return (
        <div className="space-y-6 animate-fadeInUp">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
                <UserCircleIcon className="w-12 h-12 mx-auto text-purple-500 mb-3" />
                <h3 className="font-bold text-gray-800 text-lg">Data Breach Monitor</h3>
                <p className="text-sm text-gray-500 mb-6">Check if your email or phone number has been exposed in known dark web data leaks.</p>
                
                {breaches === null ? (
                    <button onClick={handleCheck} disabled={checking} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md transition-all disabled:opacity-70">
                        {checking ? 'Scanning Dark Web...' : 'Scan Now'}
                    </button>
                ) : (
                    <div className="text-left animate-fadeInUp">
                        {breaches.length === 0 ? (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-center space-x-3">
                                <CheckCircleIcon className="text-green-600 w-8 h-8" />
                                <div><h4 className="font-bold text-green-800">All Clear</h4><p className="text-sm text-green-700">No breaches found for your ID.</p></div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-800 font-bold text-center">
                                    {breaches.length} Breach(es) Found!
                                </div>
                                {breaches.map((breach, i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                        <p className="font-bold text-gray-800">{breach.source}</p>
                                        <p className="text-xs text-gray-500 mb-2">Date: {breach.date}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {breach.compromisedData.map(d => <span key={d} className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">{d}</span>)}
                                        </div>
                                    </div>
                                ))}
                                <p className="text-xs text-gray-500 text-center mt-4">Recommendation: Change your passwords immediately.</p>
                            </div>
                        )}
                         <button onClick={() => setBreaches(null)} className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline">Check Another ID</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const CyberSafetyPage: React.FC<CyberSafetyPageProps> = ({ onBack }) => {
    const { user } = useContext(UserContext);
    const { showToast } = useNotifications();
    
    // Manual Analyzer State
    const [inputText, setInputText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ category: CyberCategory; level: ThreatLevel; advice: string } | null>(null);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    
    // Background Monitoring State
    const [isMonitoringActive, setIsMonitoringActive] = useState(false);
    const [interceptedMessage, setInterceptedMessage] = useState<InterceptedMessage | null>(null);
    const monitoringTimerRef = useRef<number | null>(null);
    
    // Tab State
    const [activeTab, setActiveTab] = useState<'message' | 'url' | 'identity'>('message');

    useEffect(() => {
        return () => { if (monitoringTimerRef.current) clearTimeout(monitoringTimerRef.current); };
    }, []);

    const toggleMonitoring = () => {
        if (isMonitoringActive) {
            setIsMonitoringActive(false);
            if (monitoringTimerRef.current) clearTimeout(monitoringTimerRef.current);
            showToast("Background protection disabled.");
        } else {
            setIsMonitoringActive(true);
            showToast("Cyber Guard Active. Running in background...");
            monitoringTimerRef.current = window.setTimeout(async () => {
                const threat = await mockApi.simulateIncomingThreat();
                setInterceptedMessage(threat);
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            }, 5000); 
        }
    };

    const handleAnalyze = async () => {
        if (!inputText.trim() && !screenshot) { showToast('Please paste text or upload a screenshot.'); return; }
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Analyze this text (and ignore image for now, pretend OCR) for cyber threats in an Indian context. Text: "${inputText}". Classify into one of: 'Harassment / Abuse', 'Threat to Life', 'Blackmail / Sexual Extortion', 'Unwanted Explicit Media', 'Financial Scam / Fraud', 'Cyberstalking', 'Safe'. Determine Threat Level: 'Low', 'Medium', 'High', 'Critical'. Provide short advice (max 20 words). Respond in JSON format: { "category": "...", "level": "...", "advice": "..." }`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json" } });
            const result = JSON.parse(response.text || '{}');
            setAnalysisResult(result);
        } catch (error) { console.error("AI Error", error); showToast("Analysis failed. Please try again."); } finally { setIsAnalyzing(false); }
    };

    const handleReportToCyberCell = async (source: 'manual' | 'intercepted') => {
        if (!user) return;
        let reportData;
        if (source === 'manual' && analysisResult) {
             // FIX: Added required fields (title, description) and corrected the API method to mockApi.createReport.
             reportData = { 
                 title: `Cyber Crime: ${analysisResult.category}`,
                 category: 'Cyber Crime',
                 description: `AI Analysis detected a ${analysisResult.level} threat. Sample: ${inputText}`,
                 senderId: "Unknown/Hidden", 
                 contentSample: inputText, 
                 evidenceImage: screenshot || undefined, 
                 threatLevel: analysisResult.level, 
                 user: { name: user.name, contact: user.phone, location: user.location.coords } 
             };
        } else if (source === 'intercepted' && interceptedMessage) {
            // FIX: Added required fields (title, description) and corrected the API method to mockApi.createReport.
            reportData = { 
                title: `Intercepted Threat: ${interceptedMessage.detectedCategory}`,
                category: 'Cyber Crime',
                description: `Intercepted ${interceptedMessage.platform} message from ${interceptedMessage.sender}: ${interceptedMessage.content}`,
                senderId: interceptedMessage.sender, 
                contentSample: interceptedMessage.content, 
                threatLevel: interceptedMessage.threatLevel, 
                user: { name: user.name, contact: user.phone, location: user.location.coords } 
            };
        }
        if (reportData) {
            // FIX: Updated to call mockApi.createReport with the user object as required.
            await mockApi.createReport(reportData, user);
            showToast("Report securely sent to Cyber Crime Unit.");
            setAnalysisResult(null); setInputText(''); setScreenshot(null); setInterceptedMessage(null);
        }
    };

    return (
        <ServicePageLayout title="Cyber Guard Suite" subtitle="AI-Powered Digital Protection" onBack={onBack}>
            {interceptedMessage && <InterceptModal message={interceptedMessage} onClose={() => setInterceptedMessage(null)} onReport={() => handleReportToCyberCell('intercepted')} />}

            <div className="space-y-6 animate-fadeInUp">
                {/* Top Security Score & Toggle */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                    {isMonitoringActive && <BackgroundRadar />}
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold">System Status</h2>
                                <p className={`text-sm font-medium transition-colors duration-300 ${isMonitoringActive ? 'text-emerald-400' : 'text-orange-400'}`}>
                                    {isMonitoringActive ? 'Protected - Scanning...' : 'Protection Paused'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-emerald-400">85%</p>
                                <p className="text-xs text-slate-400">Security Score</p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700 backdrop-blur-sm">
                             <span className="text-sm font-semibold flex items-center"><ShieldCheckIcon className="w-5 h-5 mr-2 text-emerald-400"/> Background Monitor</span>
                             <button onClick={toggleMonitoring} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isMonitoringActive ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isMonitoringActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                    
                    {!isMonitoringActive && (
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-20 blur-3xl pointer-events-none"></div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl">
                    <button onClick={() => setActiveTab('message')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'message' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Message Guard</button>
                    <button onClick={() => setActiveTab('url')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'url' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Link Scanner</button>
                    <button onClick={() => setActiveTab('identity')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'identity' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>Identity Check</button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'message' && (
                        <ManualAnalyzer 
                            inputText={inputText} setInputText={setInputText} 
                            screenshot={screenshot} setScreenshot={setScreenshot} 
                            isAnalyzing={isAnalyzing} handleAnalyze={handleAnalyze} 
                            analysisResult={analysisResult} handleReport={() => handleReportToCyberCell('manual')}
                            setAnalysisResult={setAnalysisResult}
                        />
                    )}
                    {activeTab === 'url' && <UrlScanner />}
                    {activeTab === 'identity' && <IdentityCheck />}
                </div>

                 {/* Live Ticker */}
                 <div className="bg-slate-100 rounded-xl p-3 overflow-hidden whitespace-nowrap">
                    <div className="inline-block animate-[drive-by_15s_linear_infinite]">
                        <span className="text-xs font-semibold text-slate-600 mx-4">🔴 High Alert: New 'Electricity Bill' SMS scam reported in Sector 4</span>
                        <span className="text-xs font-semibold text-slate-600 mx-4">🔴 Warning: Fake 'Job Offer' links on WhatsApp circulating</span>
                        <span className="text-xs font-semibold text-slate-600 mx-4">🟢 Tip: Enable 2FA on all your social accounts</span>
                    </div>
                </div>
            </div>
        </ServicePageLayout>
    );
};

export default CyberSafetyPage;
