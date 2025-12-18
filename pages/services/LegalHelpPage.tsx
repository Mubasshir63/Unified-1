
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { AiAssistantIcon, InfoIcon } from '../../components/icons/NavIcons';

interface LegalHelpPageProps {
  onBack: () => void;
  onLaunchAiAssistant: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-3">
            <div className="mr-3 text-green-600">
                <InfoIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-600 pl-9">{children}</div>
    </div>
);

const LegalHelpPage: React.FC<LegalHelpPageProps> = ({ onBack, onLaunchAiAssistant }) => {
    const { t } = useTranslation();

    return (
        <ServicePageLayout
            title={t('legalHelp')}
            subtitle={t('legalHelpDesc')}
            onBack={onBack}
        >
            <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border-2 border-green-500 shadow-lg">
                    <div className="flex items-center mb-3">
                        <div className="mr-3 text-green-600">
                            <AiAssistantIcon />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">{t('aiLegalAssistantTitle')}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 pl-9">{t('aiLegalAssistantDesc')}</p>
                    <button 
                        onClick={onLaunchAiAssistant}
                        className="w-full py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-sm ml-9"
                        style={{width: 'calc(100% - 2.25rem)'}}
                    >
                        {t('launchAiAssistant')}
                    </button>
                </div>
                
                <InfoCard title={t('knowYourRightsTitle')}>
                    <ul className="list-disc list-outside pl-5 space-y-1">
                        <li>Right to Equality: No discrimination on grounds of religion, race, caste, sex or place of birth.</li>
                        <li>Right to Information (RTI): Right to request information from any public authority.</li>
                        <li>Right to Privacy: Protection from surveillance and intrusion into personal life.</li>
                    </ul>
                </InfoCard>

                <InfoCard title={t('firFilingTitle')}>
                    <ul className="list-decimal list-outside pl-5 space-y-1">
                        <li>Go to the nearest police station to report the crime.</li>
                        <li>Provide all the information you have clearly to the police officer.</li>
                        <li>The information will be recorded by the police. It is your right to get a copy of the FIR for free.</li>
                        <li>If the police refuse to register an FIR, you can send your complaint in writing to the Superintendent of Police.</li>
                    </ul>
                </InfoCard>

                <InfoCard title={t('statePolicePortalsTitle')}>
                    <p>Access your state's official police portal for online services, citizen charters, and more.</p>
                    <a href="https://www.police.gov.in/" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
                        Find Your State Police Portal &rarr;
                    </a>
                </InfoCard>
            </div>
        </ServicePageLayout>
    );
};

export default LegalHelpPage;
