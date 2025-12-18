import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { PayBillsIcon } from '../../components/icons/NavIcons';

interface PropertyTaxPageProps {
  onBack: () => void;
}

const PropertyTaxPage: React.FC<PropertyTaxPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [propertyId, setPropertyId] = useState('');
    
    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        showToast(`Fetching details for Property ID: ${propertyId}`);
    };

    return (
        <ServicePageLayout title={t('propertyTax')} subtitle={t('propertyTaxDesc')} onBack={onBack}>
             <div className="bg-white p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <PayBillsIcon className="w-8 h-8"/>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Pay Property Tax</h2>
                </div>
                <form onSubmit={handlePay} className="space-y-4">
                    <input type="text" placeholder="Enter Property ID" value={propertyId} onChange={e => setPropertyId(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                    <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700">Fetch & Pay</button>
                </form>
            </div>
        </ServicePageLayout>
    );
};

export default PropertyTaxPage;
