import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { HeartIcon, CheckCircleIcon } from '../../components/icons/NavIcons';

interface BookVaccinationPageProps {
  onBack: () => void;
}

const BookVaccinationPage: React.FC<BookVaccinationPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [vaccine, setVaccine] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Booking vaccination slot...');
        setTimeout(() => setSubmitted(true), 1000);
    };
    
    if (submitted) {
        return (
             <ServicePageLayout title={t('bookVaccination')} subtitle={t('bookVaccinationDesc')} onBack={onBack}>
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4 inline-block">
                        <CheckCircleIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Slot Booked!</h2>
                    <p className="text-gray-600 mt-2">Your vaccination slot has been booked. You will receive a confirmation message shortly.</p>
                    <button onClick={onBack} className="mt-6 w-full max-w-xs py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transition-transform shadow-lg">
                        Back to Services
                    </button>
                </div>
            </ServicePageLayout>
        )
    }

    return (
        <ServicePageLayout title={t('bookVaccination')} subtitle={t('bookVaccinationDesc')} onBack={onBack}>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-xl border border-gray-200">
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl" />
                <select value={vaccine} onChange={e => setVaccine(e.target.value)} required className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl">
                    <option value="">-- Select Vaccine --</option>
                    <option value="covishield">Covishield</option>
                    <option value="covaxin">Covaxin</option>
                    <option value="sputnik">Sputnik V</option>
                </select>
                <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700">Book Slot</button>
            </form>
        </ServicePageLayout>
    );
};

export default BookVaccinationPage;
