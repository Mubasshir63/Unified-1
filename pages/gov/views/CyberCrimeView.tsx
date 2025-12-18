
import React, { useState, useEffect, useMemo, useRef } from 'react';
import KpiCard from '../components/KpiCard';
import { ShieldCheckIcon, ExclamationTriangleIcon, LockClosedIcon, MapIcon, SearchIcon, FingerPrintIcon, UsersIcon, AiAssistantIcon } from '../../../components/icons/NavIcons';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { CyberReport, ThreatLevel, NetworkNode, NetworkLink } from '../../../types';
import * as mockApi from '../../../api/mockApi';
import { GoogleGenAI } from "@google/genai";

declare const L: any; // Leaflet type

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface CyberCrimeViewProps {
    isLoading: boolean;
}

const NetworkGraph: React.FC = () => {
    const [graphData, setGraphData] = useState<{nodes: NetworkNode[], links: NetworkLink[]} | null>(null);

    useEffect(() => {
        mockApi.getCriminalNetwork().then(setGraphData);
    }, []);

    if (!graphData) return <div className="h-full flex items-center justify-center text-cyan-500/50 font-mono animate-pulse">INITIALIZING NETWORK PROTOCOL...</div>;

    // Simple SVG visualization for the network
    return (
        <div className="h-full w-full bg-slate-950 rounded-lg relative overflow-hidden border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
             {/* Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
             
             <svg className="w-full h-full relative z-10">
                 {graphData.links.map((link, i) => {
                     const sourceNode = graphData.nodes.find(n => n.id === link.source);
                     const targetNode = graphData.nodes.find(n => n.id === link.target);
                     if(!sourceNode || !targetNode) return null;
                     
                     // Mock positions based on index for simplicity in this static view
                     const sIndex = graphData.nodes.indexOf(sourceNode);
                     const tIndex = graphData.nodes.indexOf(targetNode);
                     const sx = 100 + (sIndex * 60) + (sIndex % 2) * 60;
                     const sy = 100 + (sIndex * 50);
                     const tx = 100 + (tIndex * 60) + (tIndex % 2) * 60;
                     const ty = 100 + (tIndex * 50);
                     
                     return (
                         <line key={i} x1={sx} y1={sy} x2={tx} y2={ty} stroke="#0891b2" strokeWidth="1" strokeOpacity="0.5" />
                     );
                 })}
                  {graphData.nodes.map((node, i) => {
                      const cx = 100 + (i * 60) + (i % 2) * 60;
                      const cy = 100 + (i * 50);
                      let color = '#22d3ee'; // default cyan
                      if (node.type === 'Scammer') color = '#ef4444'; // red
                      if (node.type === 'Victim') color = '#3b82f6'; // blue
                      if (node.type === 'IP') color = '#eab308'; // yellow

                      return (
                          <g key={node.id} className="cursor-pointer hover:opacity-80">
                              <circle cx={cx} cy={cy} r="6" fill={color} className="animate-pulse" style={{animationDuration: '3s'}} />
                              <circle cx={cx} cy={cy} r="12" fill="transparent" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
                              <text x={cx} y={cy + 20} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">{node.label}</text>
                          </g>
                      );
                  })}
             </svg>
             <div className="absolute top-2 left-2 bg-slate-900/80 p-2 rounded border border-cyan-900/50 text-[10px] text-cyan-400 font-mono">
                 <div className="flex items-center mb-1"><span className="w-2 h-2 bg-red-500 rounded-full mr-2 shadow-[0_0_5px_red]"></span>Suspect Node</div>
                 <div className="flex items-center mb-1"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2 shadow-[0_0_5px_blue]"></span>Victim Node</div>
                 <div className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 shadow-[0_0_5px_yellow]"></span>IP / Device</div>
             </div>
        </div>
    );
};

const AiDetective: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('// INTELLIGENCE CORE ONLINE.\n// WAITING FOR INPUT...');
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setResponse('// PROCESSING QUERY...');
        try {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
             const prompt = `You are a Cyber Crime Intelligence AI analyst. User Query: "${query}". 
             Context: You have access to a database of recent cyber reports, sender IDs, threat levels, and locations.
             Simulate a professional intelligence response based on typical cyber crime patterns in India.
             Format as a concise report. Use technical jargon.`;
             
             const res = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
             setResponse(res.text || '// NO INTELLIGENCE FOUND.');
        } catch (e) {
            setResponse('// CONNECTION ERROR. RETRY.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 rounded-xl border border-cyan-900/50 h-full flex flex-col overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <div className="p-4 bg-slate-900 border-b border-cyan-900/50 flex items-center">
                <AiAssistantIcon className="w-5 h-5 mr-2 text-cyan-400" />
                <h3 className="font-bold text-cyan-100 font-mono text-sm">AI_DETECTIVE_V2.0</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono text-cyan-300/80 space-y-4 bg-slate-950">
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <span className="animate-pulse text-cyan-500">▐</span>
                        <span>ANALYZING_DATABASE...</span>
                    </div>
                ) : (
                     <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
                )}
            </div>
            <div className="p-3 border-t border-cyan-900/50 bg-slate-900">
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="QUERY_DB >" 
                        className="flex-1 bg-slate-950 border border-cyan-900/50 rounded px-3 py-2 text-xs text-cyan-100 font-mono focus:ring-1 focus:ring-cyan-500 outline-none placeholder-cyan-800"
                        onKeyPress={e => e.key === 'Enter' && handleAsk()}
                    />
                    <button onClick={handleAsk} className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-400 p-2 rounded border border-cyan-700/50"><SearchIcon className="w-4 h-4"/></button>
                </div>
            </div>
        </div>
    );
};


const CyberCrimeView: React.FC<CyberCrimeViewProps> = ({ isLoading: initialIsLoading }) => {
    const [reports, setReports] = useState<CyberReport[]>([]);
    const [isLoading, setIsLoading] = useState(initialIsLoading);
    const [viewMode, setViewMode] = useState<'map' | 'network'>('map');
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        setIsLoading(true);
        mockApi.getCyberReports().then(data => {
            setReports(data);
            setIsLoading(false);
        });
    }, []);

    // Map Effect
    useEffect(() => {
        if (!isLoading && viewMode === 'map' && mapContainerRef.current && !mapInstanceRef.current && reports.length > 0) {
             const map = L.map(mapContainerRef.current, { 
                 center: [20.5937, 78.9629], 
                 zoom: 5,
                 zoomControl: false,
                 attributionControl: false
             });
             
             // Dark Matter Tiles for that Cyber Look
             L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);

             const heatData = reports.map(r => [r.user.location.lat, r.user.location.lng, r.threatLevel === 'Critical' ? 1 : 0.5]);
             // Cyber colors: Cyan to Red
             L.heatLayer(heatData, { radius: 25, gradient: {0.2: '#0891b2', 0.6: '#22d3ee', 1: '#ef4444'} }).addTo(map);

             mapInstanceRef.current = map;
        } else if (viewMode !== 'map' && mapInstanceRef.current) {
             mapInstanceRef.current.remove();
             mapInstanceRef.current = null;
        }
    }, [isLoading, viewMode, reports]);


    if (isLoading) return <div className="p-6 h-full w-full bg-slate-950 flex items-center justify-center text-cyan-500 font-mono animate-pulse">LOADING CYBER UNIT...</div>;

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeInUp h-full flex flex-col bg-slate-950 text-cyan-50">
            <div className="flex justify-between items-center border-b border-cyan-900/30 pb-4">
                <h1 className="text-2xl font-bold text-cyan-100 flex items-center font-mono tracking-tight">
                    <FingerPrintIcon className="w-6 h-6 mr-3 text-cyan-500" />
                    CYBER_CRIME_INTELLIGENCE_UNIT
                </h1>
                <div className="flex space-x-3">
                     <button className="px-4 py-1.5 bg-red-900/20 border border-red-500/50 text-red-400 rounded text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:bg-red-900/40 flex items-center tracking-wider">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-2"/> LOCKDOWN_PROTOCOL
                    </button>
                    <div className="bg-slate-900 border border-cyan-900/50 rounded p-1 flex">
                        <button onClick={() => setViewMode('map')} className={`px-3 py-1 rounded text-xs font-medium transition-all font-mono ${viewMode === 'map' ? 'bg-cyan-900/50 text-cyan-300 shadow-inner' : 'text-cyan-700 hover:text-cyan-400'}`}>HEATMAP</button>
                        <button onClick={() => setViewMode('network')} className={`px-3 py-1 rounded text-xs font-medium transition-all font-mono ${viewMode === 'network' ? 'bg-cyan-900/50 text-cyan-300 shadow-inner' : 'text-cyan-700 hover:text-cyan-400'}`}>NETWORK</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900/50 border border-cyan-900/30 p-4 rounded-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-cyan-500"><SearchIcon className="w-12 h-12"/></div>
                    <p className="text-xs text-cyan-600 font-mono uppercase">Active Cases</p>
                    <p className="text-2xl font-bold text-cyan-100 font-mono">{reports.filter(r => r.status === 'Investigating').length}</p>
                </div>
                <div className="bg-slate-900/50 border border-red-900/30 p-4 rounded-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-red-500"><ExclamationTriangleIcon className="w-12 h-12"/></div>
                    <p className="text-xs text-red-600 font-mono uppercase">Critical Threats</p>
                    <p className="text-2xl font-bold text-red-100 font-mono">{reports.filter(r => r.threatLevel === 'Critical').length}</p>
                </div>
                <div className="bg-slate-900/50 border border-green-900/30 p-4 rounded-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-green-500"><ShieldCheckIcon className="w-12 h-12"/></div>
                    <p className="text-xs text-green-600 font-mono uppercase">URLs Blocked</p>
                    <p className="text-2xl font-bold text-green-100 font-mono">142</p>
                </div>
                <div className="bg-slate-900/50 border border-yellow-900/30 p-4 rounded-lg relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-yellow-500"><LockClosedIcon className="w-12 h-12"/></div>
                    <p className="text-xs text-yellow-600 font-mono uppercase">Evidence Size</p>
                    <p className="text-2xl font-bold text-yellow-100 font-mono">856 GB</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
                 {/* Main Visual Container */}
                 <div className="bg-slate-900 border border-cyan-900/30 col-span-2 rounded-xl overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                    {viewMode === 'map' ? (
                         <div ref={mapContainerRef} className="w-full h-full min-h-[400px] bg-slate-950 z-0 opacity-80 hover:opacity-100 transition-opacity" />
                    ) : (
                        <div className="w-full h-full min-h-[400px] bg-slate-950 p-4">
                            <h3 className="text-cyan-500/50 text-xs font-mono font-bold mb-2 absolute top-4 left-4 z-10">SYNDICATE_TOPOLOGY_V1</h3>
                            <NetworkGraph />
                        </div>
                    )}
                 </div>

                {/* AI Side Panel */}
                <div className="col-span-1 h-full">
                    <AiDetective />
                </div>
            </div>

             {/* Action Console & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[400px]">
                
                <div className="bg-slate-900 rounded-xl border border-cyan-900/30 p-4">
                    <h3 className="font-bold text-cyan-100 mb-4 border-b border-cyan-900/30 pb-2 font-mono text-xs tracking-wider">QUICK_COMMANDS</h3>
                    <div className="space-y-2">
                        <button className="w-full p-2 bg-slate-800/50 hover:bg-cyan-900/20 border border-slate-700 hover:border-cyan-700 rounded text-left text-xs text-cyan-200 font-mono flex items-center transition-colors">
                             <LockClosedIcon className="w-3 h-3 mr-2 text-cyan-500"/> BLOCK_SENDER_ID
                        </button>
                        <button className="w-full p-2 bg-slate-800/50 hover:bg-yellow-900/20 border border-slate-700 hover:border-yellow-700 rounded text-left text-xs text-yellow-200 font-mono flex items-center transition-colors">
                             <ExclamationTriangleIcon className="w-3 h-3 mr-2 text-yellow-500"/> ISSUE_ADVISORY
                        </button>
                         <button className="w-full p-2 bg-slate-800/50 hover:bg-blue-900/20 border border-slate-700 hover:border-blue-700 rounded text-left text-xs text-blue-200 font-mono flex items-center transition-colors">
                             <SearchIcon className="w-3 h-3 mr-2 text-blue-500"/> DOMAIN_TAKEDOWN
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3 bg-slate-900 rounded-xl border border-cyan-900/30 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-cyan-900/30 flex justify-between items-center bg-slate-900">
                        <h3 className="font-bold text-cyan-100 font-mono text-xs">LIVE_INTELLIGENCE_FEED</h3>
                        <span className="text-[10px] text-cyan-500 font-mono animate-pulse">● STREAM_ACTIVE</span>
                    </div>
                    <div className="flex-1 overflow-auto bg-slate-950/50">
                        <table className="w-full text-left text-xs text-slate-400 font-mono">
                            <thead className="bg-slate-900 text-cyan-600 uppercase sticky top-0">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Threat Class</th>
                                    <th className="p-3">Level</th>
                                    <th className="p-3">Origin</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {reports.map(report => (
                                    <tr key={report.id} className="hover:bg-cyan-900/10 transition-colors">
                                        <td className="p-3 text-slate-500">{report.id}</td>
                                        <td className="p-3 text-cyan-200">{report.category}</td>
                                        <td className="p-3">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                                report.threatLevel === 'Critical' ? 'bg-red-950 text-red-400 border-red-900' :
                                                report.threatLevel === 'High' ? 'bg-orange-950 text-orange-400 border-orange-900' :
                                                'bg-cyan-950 text-cyan-400 border-cyan-900'
                                            }`}>{report.threatLevel.toUpperCase()}</span>
                                        </td>
                                        <td className="p-3 text-slate-500">{report.senderId}</td>
                                        <td className="p-3">
                                            <button className="text-cyan-400 hover:text-cyan-200 border border-cyan-800 hover:border-cyan-500 px-2 py-0.5 rounded text-[10px] transition-colors">ANALYZE</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CyberCrimeView;