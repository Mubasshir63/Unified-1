import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { DocumentTextIcon, UserCircleIcon, KeyIcon } from '../../components/icons/NavIcons';

interface DigitalLockerPageProps {
  onBack: () => void;
}

const DocumentItem: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; }> = ({ icon, title, subtitle }) => (
    <div className="w-full flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-green-400 transition-all duration-200 group">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-gray-600 group-hover:text-green-600 transition-colors">
            {icon}
        </div>
        <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <button className="text-sm font-semibold text-green-600">View</button>
    </div>
);


const DigitalLockerPage: React.FC<DigitalLockerPageProps> = ({ onBack }) => {
    const { t } = useTranslation();

    const documents = [
        { title: 'Aadhaar Card', subtitle: 'UIDAI', icon: <UserCircleIcon /> },
        { title: 'PAN Card', subtitle: 'Income Tax Dept.', icon: <DocumentTextIcon /> },
        { title: 'Driving License', subtitle: 'Ministry of Road Transport', icon: <DocumentTextIcon /> },
        { title: 'Class X Marksheet', subtitle: 'CBSE', icon: <DocumentTextIcon /> },
        { title: 'Vehicle RC', subtitle: 'Ministry of Road Transport', icon: <DocumentTextIcon /> },
    ];

    return (
        <ServicePageLayout title={t('digitalLocker')} subtitle={t('digitalLockerDesc')} onBack={onBack}>
             <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200/50 rounded-xl p-4 flex items-start space-x-4">
                    <div className="flex-shrink-0 text-blue-600 pt-1">
                        <KeyIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900">Your documents are safe</h3>
                        <p className="text-sm text-blue-800/90 mt-1">
                            Digital Locker is a secure cloud-based platform for storage, sharing and verification of documents & certificates.
                        </p>
                    </div>
                </div>
                <div className="space-y-3">
                    {documents.map(doc => (
                        <DocumentItem key={doc.title} {...doc} />
                    ))}
                </div>
            </div>
        </ServicePageLayout>
    );
};

export default DigitalLockerPage;