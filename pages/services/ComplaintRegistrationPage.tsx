import React, { useState, useContext } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotifications } from '../../contexts/NotificationsContext';
import ServicePageLayout from './ServicePageLayout';
import { CameraIcon, CheckCircleIcon, InfoIcon } from '../../components/icons/NavIcons';
import { UserContext } from '../../contexts/UserContext';

interface ComplaintRegistrationPageProps {
  onBack: () => void;
  onCreateIssue: (issueData: {
      title: string;
      category: string;
      description: string;
      coords: { lat: number; lng: number };
      priority: 'Medium';
  }) => void;
}

const ComplaintRegistrationPage: React.FC<ComplaintRegistrationPageProps> = ({ onBack, onCreateIssue }) => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const { showToast } = useNotifications();
    const [department, setDepartment] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const departmentInfo: Record<string, { description: string; contact: string }> = {
        pwb: { description: 'Handles road maintenance, public buildings, and infrastructure projects.', contact: 'Tel: 1800-123-4567' },
        sanitation: { description: 'Manages waste collection, street cleaning, and public hygiene.', contact: 'Email: sanitation@citycorp.gov' },
        water: { description: 'Responsible for water supply, pipeline maintenance, and billing inquiries.', contact: 'WhatsApp: +91 98765 43210' },
        electricity: { description: 'Manages power supply, streetlight maintenance, and outage reports.', contact: 'Emergency Line: 1912' },
        other: { description: 'For all other issues not covered by the departments above.', contact: 'Please describe the issue clearly for proper routing.' }
    };

    const [selectedDeptInfo, setSelectedDeptInfo] = useState<{ description: string; contact: string } | null>(null);

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setDepartment(value);
        if (value && departmentInfo[value]) {
            setSelectedDeptInfo(departmentInfo[value]);
        } else {
            setSelectedDeptInfo(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!department || !details || !user) return;
        setIsSubmitting(true);
        setTimeout(() => {
            onCreateIssue({
                title: `Complaint: ${department}`,
                category: `Complaint - ${department}`,
                description: details,
                coords: user.location.coords,
                priority: 'Medium',
            });
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    if (submitted) {
        return (
            <ServicePageLayout
                title={t('complaintRegistration')}
                subtitle={t('complaintRegistrationDesc')}
                onBack={onBack}
            >
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4 inline-block">
                        <CheckCircleIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Complaint Submitted</h2>
                    <p className="text-gray-600 mt-2">Your complaint has been registered. You can track its progress in the 'My Reports' section.</p>
                    <button onClick={onBack} className="mt-6 w-full max-w-xs py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transition-transform shadow-lg">
                        Back to Services
                    </button>
                </div>
            </ServicePageLayout>
        );
    }
    
    const selectClasses = "w-full px-4 py-3 bg-white border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";

    return (
        <ServicePageLayout
            title={t('complaintRegistration')}
            subtitle={t('complaintRegistrationDesc')}
            onBack={onBack}
        >
            <style>{`
                @keyframes fadeInInfo {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInInfo { animation: fadeInInfo 0.4s ease-out forwards; }
            `}</style>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="department" className="text-sm font-medium text-gray-700 block mb-2">{t('selectDepartment')}</label>
                    <select id="department" value={department} onChange={handleDepartmentChange} className={selectClasses} required>
                        <option value="">-- Select --</option>
                        <option value="Public Works">{t('publicWorks')}</option>
                        <option value="Sanitation">{t('sanitation')}</option>
                        <option value="Water Supply">{t('waterSupply')}</option>
                        <option value="Electricity">{t('electricity')}</option>
                        <option value="Other">{t('other')}</option>
                    </select>
                    {selectedDeptInfo && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3 animate-fadeInInfo">
                             <div className="flex-shrink-0 mt-1 text-blue-500">
                                <InfoIcon />
                            </div>
                            <div>
                                <p className="text-sm text-blue-800">{selectedDeptInfo.description}</p>
                                <p className="text-xs font-semibold text-blue-600 mt-1">{selectedDeptInfo.contact}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="details" className="text-sm font-medium text-gray-700 block mb-2">{t('complaintDetails')}</label>
                    <textarea 
                        id="details"
                        rows={6}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder={t('complaintPlaceholder')}
                        required
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                </div>
                
                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">{t('uploadDocs')}</label>
                     <button type="button" className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-green-500 transition-colors">
                        <CameraIcon />
                        <span className="mt-1 text-sm font-semibold">Upload Files</span>
                    </button>
                </div>
                
                 <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform shadow-lg">
                    {isSubmitting ? t('submitting') : t('submitComplaint')}
                </button>
            </form>
        </ServicePageLayout>
    );
};

export default ComplaintRegistrationPage;