import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useNotifications } from '../../contexts/NotificationsContext';
import { DocumentTextIcon, PayBillsIcon } from '../../components/icons/NavIcons';
import ServicePageLayout from './ServicePageLayout';

interface DownloadCenterPageProps {
  onBack: () => void;
}

interface DownloadItemProps {
    docKey: string;
    title: string;
    placeholder: string;
    icon: React.ReactNode;
    isActive: boolean;
    onToggle: () => void;
}

const DownloadItem: React.FC<DownloadItemProps> = ({ docKey, title, placeholder, icon, isActive, onToggle }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [inputValue, setInputValue] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!inputValue) return;
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            showToast(t('downloadSuccess', { document: title }));
            setInputValue('');
        }, 1500);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 transition-all duration-300 ease-in-out overflow-hidden">
            <button 
                onClick={onToggle}
                className="w-full flex justify-between items-center p-4 text-left"
            >
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                        {icon}
                    </div>
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                 <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div 
                className={`transition-all duration-300 ease-in-out ${isActive ? 'max-h-40' : 'max-h-0'}`}
            >
                <div className="p-4 border-t border-gray-100 space-y-3">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <button 
                        onClick={handleDownload}
                        disabled={!inputValue || isDownloading}
                        className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center space-x-2"
                    >
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{t('downloading')}</span>
                            </>
                        ) : (
                            <span>{t('downloadPdf')}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DownloadCenterPage: React.FC<DownloadCenterPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [activeItem, setActiveItem] = useState<string | null>(null);

    const handleToggle = (docKey: string) => {
        setActiveItem(prev => (prev === docKey ? null : docKey));
    };
    
    const certificates = [
        { key: 'aadhaar', title: t('aadhaarCard'), placeholder: t('enterAadhaar'), icon: <DocumentTextIcon /> },
        { key: 'birth', title: t('birthCertificate'), placeholder: t('enterCertNumber'), icon: <DocumentTextIcon /> },
        { key: 'death', title: t('deathCertificate'), placeholder: t('enterCertNumber'), icon: <DocumentTextIcon /> },
        { key: 'income', title: t('incomeCertificate'), placeholder: t('enterCertNumber'), icon: <DocumentTextIcon /> },
    ];

    const bills = [
        { key: 'electricity', title: t('electricityBill'), placeholder: t('enterConsumerNumber'), icon: <PayBillsIcon className="w-8 h-8"/> },
        { key: 'water', title: t('waterBill'), placeholder: t('enterConsumerNumber'), icon: <PayBillsIcon className="w-8 h-8" /> },
        // FIX: Updated translation key to 'propertyTaxBill' to match the fix in translations.ts.
        { key: 'tax', title: t('propertyTaxBill'), placeholder: t('enterPropertyId'), icon: <PayBillsIcon className="w-8 h-8"/> },
    ];

    return (
        <ServicePageLayout
            title={t('downloadCenter')}
            subtitle={t('downloadCenterDesc')}
            onBack={onBack}
        >
            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{t('downloadCertificates')}</h2>
                    <div className="space-y-3">
                        {certificates.map(doc => (
                            <DownloadItem 
                                key={doc.key}
                                docKey={doc.key}
                                title={doc.title}
                                placeholder={doc.placeholder}
                                icon={doc.icon}
                                isActive={activeItem === doc.key}
                                onToggle={() => handleToggle(doc.key)}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{t('downloadBills')}</h2>
                    <div className="space-y-3">
                        {bills.map(doc => (
                            <DownloadItem 
                                key={doc.key}
                                docKey={doc.key}
                                title={doc.title}
                                placeholder={doc.placeholder}
                                icon={doc.icon}
                                isActive={activeItem === doc.key}
                                onToggle={() => handleToggle(doc.key)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </ServicePageLayout>
    );
};

export default DownloadCenterPage;
