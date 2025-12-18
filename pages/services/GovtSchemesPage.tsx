


import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotifications } from '../../contexts/NotificationsContext';
import ServicePageLayout from './ServicePageLayout';
import { SchemeIcon } from '../../components/icons/NavIcons';
import { UserContext } from '../../contexts/UserContext';
import * as mockApi from '../../api/mockApi';
import { GovtScheme } from '../../types';

interface GovtSchemesPageProps {
  onBack: () => void;
}

const SchemeCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
        <div className="p-5 space-y-4">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="bg-gray-50 p-4">
            <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
        </div>
    </div>
);


const SchemeCard: React.FC<{ scheme: GovtScheme }> = ({ scheme }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const handleApply = () => showToast(`Opening application for ${scheme.title}...`);
    
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5">
                <div className="flex items-start space-x-4 mb-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <SchemeIcon />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{scheme.title}</h3>
                        <p className="text-sm text-gray-600">{scheme.description}</p>
                    </div>
                </div>
                
                <div className="space-y-3 text-sm">
                    <div>
                        <h4 className="font-semibold text-gray-700">{t('eligibility')}:</h4>
                        <p className="text-gray-600">{scheme.eligibility}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-700">{t('benefits')}:</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 pl-1">
                            {scheme.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 p-4">
                 <button 
                    onClick={handleApply}
                    className="w-full py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-sm">
                    {t('applyNow')}
                </button>
            </div>
        </div>
    );
};


const GovtSchemesPage: React.FC<GovtSchemesPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [schemes, setSchemes] = useState<GovtScheme[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchemes = async () => {
            if (!user?.location.state) {
                setError("User location not available.");
                setIsLoading(false);
                return;
            }

            try {
                const fetchedSchemes = await mockApi.getGovtSchemes(user.location.state);
                setSchemes(fetchedSchemes);
            } catch (err) {
                console.error("Error fetching schemes:", err);
                setError("Failed to fetch government schemes. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchemes();
    }, [user?.location.state]);

    return (
        <ServicePageLayout
            title={t('govtSchemes')}
            subtitle={t('govtSchemesDesc')}
            onBack={onBack}
        >
            <div className="space-y-4">
                {isLoading && (
                    <>
                        <SchemeCardSkeleton />
                        <SchemeCardSkeleton />
                    </>
                )}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!isLoading && !error && schemes.map((scheme, index) => (
                    <SchemeCard key={index} scheme={scheme} />
                ))}
            </div>
        </ServicePageLayout>
    );
};

export default GovtSchemesPage;
