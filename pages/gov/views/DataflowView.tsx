
import React, { useState, useEffect } from 'react';
import { DataflowItem } from '../../../types';
import * as mockApi from '../../../api/mockApi';
import { AiAssistantIcon, UserCircleIcon, CheckCircleIcon } from '../../../components/icons/NavIcons';

interface DataflowViewProps {
    isLoading: boolean;
}

const statusConfig = {
    Received: { icon: UserCircleIcon, color: 'blue', text: 'text-blue-400', label: 'Received' },
    Validating: { icon: AiAssistantIcon, color: 'yellow', text: 'text-yellow-400', label: 'AI Validating...' },
    Forwarded: { icon: CheckCircleIcon, color: 'green', text: 'text-green-400', label: 'AI Forwarded' },
    Failed: { icon: UserCircleIcon, color: 'red', text: 'text-red-400', label: 'Failed' },
};

const TimelineItem: React.FC<{ item: DataflowItem }> = ({ item }) => {
    // Rely purely on props for status to reflect real backend state
    const config = statusConfig[item.status] || statusConfig.Received;
    const Icon = config.icon;

    return (
        <div className="flex space-x-4 animate-fadeInUp">
            <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-700/50 border border-slate-600 ${config.text} transition-colors duration-500`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="w-0.5 grow bg-slate-700"></div>
            </div>
            <div className="pb-8 flex-1">
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700/80 transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-slate-100">{item.service}</p>
                            <p className="text-sm text-slate-400">Applicant: {item.user.name}</p>
                        </div>
                         <p className="text-xs font-mono text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-700/80">
                        <p className={`font-semibold text-sm flex items-center transition-all duration-300 ${config.text}`}>
                           <span className={`w-2 h-2 rounded-full mr-2 ${item.status === 'Validating' ? 'animate-ping' : ''}`} style={{backgroundColor: config.color}}></span>
                           {config.label}
                           {item.status === 'Forwarded' && <span className="text-slate-400 ml-2">to {item.externalSystem}</span>}
                        </p>
                        {item.status === 'Validating' && (
                            <p className="text-xs text-slate-500 mt-1 ml-4 animate-pulse">Analyzing documents & verifying identity...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const DataflowView: React.FC<DataflowViewProps> = ({ isLoading: initialLoading }) => {
    const [items, setItems] = useState<DataflowItem[]>([]);
    const [isLoading, setIsLoading] = useState(initialLoading);

    useEffect(() => {
        const fetchData = async () => {
            const data = await mockApi.getDataflowSubmissions();
            setItems(data);
            setIsLoading(false);
        };

        fetchData(); // Initial fetch

        // Poll every 2 seconds to show live updates from "backend"
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return <div className="p-6 h-full w-full animate-shimmer bg-slate-700"></div>;
    }
    
    return (
        <div className="p-4 md:p-6 animate-fadeInUp">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-slate-100 flex items-center">
                    <AiAssistantIcon className="w-8 h-8 mr-3 text-teal-400"/>
                    AI Data Pipeline
                </h1>
                <p className="text-slate-400 mt-1">Real-time visualization of AI processing and routing citizen data to external government systems (UIDAI, Passport Seva, etc.).</p>
            </header>

            <div>
                {items.length > 0 ? (
                    items.map(item => <TimelineItem key={item.id} item={item} />)
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>No active data transmissions. Submit a service request (e.g., Passport, Aadhaar) to see the flow.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataflowView;
