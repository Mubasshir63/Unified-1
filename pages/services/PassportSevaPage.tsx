
import React, { useState, useContext } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { DocumentTextIcon, CheckCircleIcon } from '../../components/icons/NavIcons';
import { UserContext } from '../../contexts/UserContext';
import * as mockApi from '../../api/mockApi';

interface PassportSevaPageProps {
  onBack: () => void;
}

const PassportSevaPage: React.FC<PassportSevaPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { showToast } = useNotifications();
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullName, setFullName] = useState(user?.name || '');
    const [passportType, setPassportType] = useState('fresh');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        
        // Create a Dataflow submission to simulate AI processing and forwarding
        await mockApi.createDataflowSubmission({
            service: 'Passport Application',
            user: { name: user.name, profilePicture: user.profilePicture },
            payload: { type: passportType, applicant: fullName },
            externalSystem: 'Passport Seva Kendra',
        });

        setIsSubmitting(false);
        setSubmitted(true);
        showToast('Passport application submitted successfully!');
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";

    if (submitted) {
        return (
            <ServicePageLayout title={t('passportSeva')} subtitle={t('passportSevaDesc')} onBack={onBack}>
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4 inline-block">
                        <CheckCircleIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Application Submitted</h2>
                    <p className="text-gray-600 mt-2 max-w-md">
                        Your application has been securely transmitted. The system is now validating your documents and will forward them to the Passport Seva Kendra. You can track this in your Profile.
                    </p>
                    <button onClick={onBack} className="mt-6 w-full max-w-xs py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transition-transform shadow-lg">
                        Back to Services
                    </button>
                </div>
            </ServicePageLayout>
        );
    }
    
    return (
        <ServicePageLayout title={t('passportSeva')} subtitle={t('passportSevaDesc')} onBack={onBack}>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                 <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <DocumentTextIcon />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Passport Application</h2>
                        <p className="text-sm text-gray-500">Apply for a new passport or reissue.</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Application Type</label>
                        <select value={passportType} onChange={e => setPassportType(e.target.value)} className={inputClasses}>
                            <option value="fresh">Fresh Passport</option>
                            <option value="reissue">Re-issue of Passport</option>
                            <option value="tatkaal">Tatkaal</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Applicant Name</label>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className={inputClasses} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Date of Birth</label>
                        <input type="date" required className={inputClasses} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Place of Birth</label>
                        <input type="text" required className={inputClasses} />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-transform transform active:scale-95">
                        {isSubmitting ? 'Processing...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </ServicePageLayout>
    );
};

export default PassportSevaPage;
