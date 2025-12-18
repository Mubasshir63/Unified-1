import React from 'react';
import { ArrowLeftIcon } from '../../components/icons/NavIcons';

interface ServicePageLayoutProps {
    title: string;
    subtitle: string;
    onBack: () => void;
    children: React.ReactNode;
}

const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({ title, subtitle, onBack, children }) => {
    return (
        <div className="bg-gray-50 min-h-full flex flex-col">
            <style>{`
                .service-header-sticky {
                    position: -webkit-sticky;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
            `}</style>
            <header className="service-header-sticky flex items-center p-4 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                <button onClick={onBack} className="p-2 mr-2 -ml-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeftIcon />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
            </header>
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
};

export default ServicePageLayout;