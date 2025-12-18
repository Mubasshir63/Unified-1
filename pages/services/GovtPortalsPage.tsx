import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { GovtPortalsIcon } from '../../components/icons/NavIcons';

interface GovtPortalsPageProps {
  onBack: () => void;
}

const PortalLink: React.FC<{ icon: React.ReactNode; title: string; url: string }> = ({ icon, title, url }) => {
    const { t } = useTranslation();
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 text-left hover:bg-gray-50 hover:border-green-400 transition-all duration-200 group"
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-gray-600 group-hover:text-green-600 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
            </div>
            <span className="text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">{t('openLink')} &rarr;</span>
        </a>
    );
};

const GovtPortalsPage: React.FC<GovtPortalsPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    
    const portals = [
        { title: t('nationalPortal'), url: 'https://www.india.gov.in/', icon: <GovtPortalsIcon /> },
        { title: t('pmIndia'), url: 'https://www.pmindia.gov.in/', icon: <GovtPortalsIcon /> },
        { title: t('ministryHealth'), url: 'https://www.mohfw.gov.in/', icon: <GovtPortalsIcon /> },
        { title: t('digitalIndia'), url: 'https://www.digitalindia.gov.in/', icon: <GovtPortalsIcon /> },
        { title: t('myGov'), url: 'https://www.mygov.in/', icon: <GovtPortalsIcon /> },
    ];

    return (
        <ServicePageLayout
            title={t('govtPortals')}
            subtitle={t('govtPortalsDesc')}
            onBack={onBack}
        >
            <div className="space-y-3">
                {portals.map(portal => (
                    <PortalLink key={portal.title} {...portal} />
                ))}
            </div>
        </ServicePageLayout>
    );
};

export default GovtPortalsPage;