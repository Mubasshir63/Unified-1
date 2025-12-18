

import React from 'react';
// FIX: The mock data is exported from mockApi.ts, not the empty homeData.ts file.
import { mockDonations } from '../../api/mockApi';
import { DonationRequest } from '../../types';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotifications } from '../../contexts/NotificationsContext';

const DonationCard: React.FC<{ request: DonationRequest }> = ({ request }) => {
    const { showToast } = useNotifications();
    const percentage = Math.round((request.raised / request.goal) * 100);

    const handleDonate = () => {
        showToast('Redirecting to a secure payment gateway...');
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-4">
            <img src={request.image} alt={request.title} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-gray-900">{request.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{request.patientName} at {request.hospital}</p>
                
                <div className="my-3">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-medium text-gray-600">Raised: ₹{request.raised.toLocaleString('en-IN')}</span>
                        <span className="font-medium text-gray-600">Goal: ₹{request.goal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
                <button 
                    onClick={handleDonate}
                    className="w-full mt-2 py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-sm">
                    Donate Now
                </button>
            </div>
        </div>
    );
}

const AllDonationsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout
            title={t('urgentMedicalNeeds')}
            subtitle="Support critical medical cases in your community"
            onBack={onBack}
        >
            <div className="space-y-4">
                {mockDonations.map(req => <DonationCard key={req.id} request={req} />)}
            </div>
        </ServicePageLayout>
    );
};

export default AllDonationsPage;