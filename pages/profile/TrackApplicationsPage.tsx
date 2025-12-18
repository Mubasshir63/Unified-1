
import React, { useEffect, useState, useContext } from 'react';
import ServicePageLayout from '../services/ServicePageLayout';
import { DataflowItem, DataflowStatus } from '../../types';
import * as mockApi from '../../api/mockApi';
import { UserContext } from '../../contexts/UserContext';
import { CheckCircleIcon, UserCircleIcon, AiAssistantIcon, DocumentTextIcon } from '../../components/icons/NavIcons';

interface TrackApplicationsPageProps {
    onBack: () => void;
}

const StatusStepper: React.FC<{ status: DataflowStatus }> = ({ status }) => {
    const steps = ['Received', 'Validating', 'Forwarded'];
    const currentStepIndex = steps.indexOf(status);
    
    // If status is failed, we handle it separately or treat it as a stop
    const isFailed = status === 'Failed';

    return (
        <div className="w-full pt-4">
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                <div className={`absolute left-0 top-1/2 h-1 bg-green-500 -z-10 transition-all duration-500 ease-out`} style={{ width: `${Math.min(currentStepIndex / (steps.length - 1) * 100, 100)}%` }}></div>
                
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    let icon = <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
                    if (isCompleted) {
                        icon = <CheckCircleIcon className="w-6 h-6 text-white" />;
                    }
                    if (isCurrent && step === 'Validating') {
                        icon = <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>;
                    }

                    return (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                                {isCompleted ? <CheckCircleIcon className="w-5 h-5 text-white" /> : <div className="w-2 h-2 bg-gray-300 rounded-full"></div>}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                        </div>
                    );
                })}
            </div>
            {status === 'Validating' && <p className="text-xs text-center text-blue-500 mt-2 animate-pulse">AI System is validating documents...</p>}
            {status === 'Forwarded' && <p className="text-xs text-center text-green-600 mt-2">Successfully forwarded to external department.</p>}
        </div>
    );
};

const ApplicationCard: React.FC<{ item: DataflowItem }> = ({ item }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-fadeInUp mb-4">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-gray-800">{item.service}</h3>
                <p className="text-xs text-gray-500">ID: {item.id}</p>
            </div>
            <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</span>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-100">
            <div className="flex items-center space-x-2 mb-1">
                <DocumentTextIcon className="w-4 h-4 text-gray-500"/>
                <span className="text-xs font-semibold text-gray-700">Details:</span>
            </div>
            <div className="text-xs text-gray-600 pl-6">
                {Object.entries(item.payload).map(([key, value]) => (
                    <div key={key}><span className="capitalize">{key}:</span> {String(value)}</div>
                ))}
            </div>
        </div>

        <StatusStepper status={item.status} />
    </div>
);

const TrackApplicationsPage: React.FC<TrackApplicationsPageProps> = ({ onBack }) => {
    const { user } = useContext(UserContext);
    const [applications, setApplications] = useState<DataflowItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const data = await mockApi.getUserDataflow(user.name);
            setApplications(data);
            setIsLoading(false);
        };

        fetchData(); // Initial fetch

        // Poll every 2 seconds to show live progress
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <ServicePageLayout title="Track Applications" subtitle="Live status of your service requests" onBack={onBack}>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading applications...</div>
                ) : applications.length > 0 ? (
                    applications.map(app => (
                        <ApplicationCard key={app.id} item={app} />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-700">No Applications Found</h3>
                        <p>You haven't submitted any service applications yet (e.g., Passport, Aadhaar).</p>
                    </div>
                )}
            </div>
        </ServicePageLayout>
    );
};

export default TrackApplicationsPage;
