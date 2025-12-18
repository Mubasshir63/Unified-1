import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { GovtPortalsIcon } from '../../components/icons/NavIcons';

interface PublicLibrariesPageProps {
  onBack: () => void;
}

const libraries = [
    { name: 'Central City Library', timings: '10 AM - 6 PM', location: 'Town Hall Complex' },
    { name: 'Anna Centenary Library', timings: '9 AM - 8 PM', location: 'Kotturpuram' },
    { name: 'District Library Branch', timings: '11 AM - 5 PM', location: 'Sector 15' },
];

const LibraryCard: React.FC<{ library: typeof libraries[0] }> = ({ library }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="font-bold text-gray-800">{library.name}</h3>
        <div className="text-sm text-gray-500 mt-1">
            <p>Timings: {library.timings}</p>
            <p>Location: {library.location}</p>
        </div>
    </div>
);


const PublicLibrariesPage: React.FC<PublicLibrariesPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    return (
        <ServicePageLayout title={t('publicLibraries')} subtitle={t('publicLibrariesDesc')} onBack={onBack}>
            <div className="space-y-3">
                {libraries.map(lib => <LibraryCard key={lib.name} library={lib} />)}
            </div>
        </ServicePageLayout>
    );
};

export default PublicLibrariesPage;
