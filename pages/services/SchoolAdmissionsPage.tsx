
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { GovtPortalsIcon, InfoIcon } from '../../components/icons/NavIcons';

interface SchoolAdmissionsPageProps {
  onBack: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-3">
            <div className="mr-3 text-green-600"><InfoIcon className="w-6 h-6"/></div>
            <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-600 pl-9">{children}</div>
    </div>
);


const SchoolAdmissionsPage: React.FC<SchoolAdmissionsPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout title={t('schoolAdmissions')} subtitle={t('schoolAdmissionsDesc')} onBack={onBack}>
            <div className="space-y-4">
                <InfoCard title="Tamil Nadu School Education">
                    <p>Admissions for the 2025-26 academic year in Tamil Nadu Government and Aided schools follow the state EMIS calendar. RTE (Right to Education) 25% quota applications usually begin in April.</p>
                </InfoCard>
                <InfoCard title="Required Documents (TN)">
                     <ul className="list-disc list-outside pl-5 space-y-1">
                        <li>Birth Certificate (Piraipu Saandridhu)</li>
                        <li>Community Certificate (Jaathi Saandridhu)</li>
                        <li>Aadhaar Card or Smart Ration Card</li>
                        <li>Income Certificate (for RTE/Scholarships)</li>
                    </ul>
                </InfoCard>
                 <a href="https://tnschools.gov.in/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center p-4 bg-white rounded-xl border border-gray-200 text-left hover:bg-gray-50 hover:border-green-400 transition-all duration-200 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-gray-600 group-hover:text-green-600 transition-colors">
                        <GovtPortalsIcon />
                    </div>
                    <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">TN Schools Portal (EMIS)</h3>
                        <p className="text-xs text-gray-500">Official Education Dept. Link</p>
                    </div>
                </a>
            </div>
        </ServicePageLayout>
    );
};

export default SchoolAdmissionsPage;
