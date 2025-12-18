
import React, { useState, useContext } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { UserCircleIcon, CheckCircleIcon } from '../../components/icons/NavIcons';
import * as mockApi from '../../api/mockApi';
import { UserContext } from '../../contexts/UserContext';

interface AadhaarServicesPageProps {
  onBack: () => void;
}

const AadhaarServicesPage: React.FC<AadhaarServicesPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { showToast } = useNotifications();
    const [name, setName] = useState(user?.name || '');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name || !dob || !address) return;

        setIsSubmitting(true);
        await mockApi.createDataflowSubmission({
            service: 'Aadhaar Enrollment',
            user: { name: user.name, profilePicture: user.profilePicture },
            payload: { name, dob, address },
            externalSystem: 'UIDAI Portal',
        });

        setIsSubmitting(false);
        setSubmitted(true);
        showToast('Aadhaar application submitted for processing!');
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";

    if (submitted) {
        return (
            <ServicePageLayout title={t('aadhaarServices')} subtitle={t('aadhaarServicesDesc')} onBack={onBack}>
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4 inline-block">
                        <CheckCircleIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Application Submitted</h2>
                    <p className="text-gray-600 mt-2 max-w-md">
                        Your application for Aadhaar Enrollment has been received. It will be automatically validated and forwarded to the official UIDAI portal. You can track the status in the Profile under 'Track Applications'.
                    </p>
                    <button onClick={onBack} className="mt-6 w-full max-w-xs py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transition-transform shadow-lg">
                        Back to Services
                    </button>
                </div>
            </ServicePageLayout>
        );
    }

    return (
        <ServicePageLayout title={t('aadhaarServices')} subtitle={t('aadhaarServicesDesc')} onBack={onBack}>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                 <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <UserCircleIcon />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">New Aadhaar Enrollment</h2>
                        <p className="text-sm text-gray-500">Submit your details to be forwarded to UIDAI.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Full Name (as per documents)</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className={inputClasses} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Date of Birth</label>
                        <input type="date" value={dob} onChange={e => setDob(e.target.value)} required className={inputClasses} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Full Residential Address</label>
                        <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)} required className={inputClasses} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50">
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </ServicePageLayout>
    );
};

export default AadhaarServicesPage;
