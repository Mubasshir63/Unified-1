import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { TransportIcon } from '../../components/icons/NavIcons';

interface MetroCardRechargePageProps {
  onBack: () => void;
}

const MetroCardRechargePage: React.FC<MetroCardRechargePageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [cardNumber, setCardNumber] = useState('');
    const [amount, setAmount] = useState('');
    
    const handleRecharge = (e: React.FormEvent) => {
        e.preventDefault();
        showToast(`Recharging card ${cardNumber} with ₹${amount}...`);
    };

    return (
        <ServicePageLayout title={t('metroCardRecharge')} subtitle={t('metroCardRechargeDesc')} onBack={onBack}>
            <div className="bg-white p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <TransportIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Recharge Your Card</h2>
                </div>
                <form onSubmit={handleRecharge} className="space-y-4">
                    <input type="text" placeholder="Enter Metro Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                    <input type="number" placeholder="Enter Amount" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                    <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700">Proceed to Pay</button>
                </form>
            </div>
        </ServicePageLayout>
    );
};

export default MetroCardRechargePage;
