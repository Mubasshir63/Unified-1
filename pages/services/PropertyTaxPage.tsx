
import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { PayBillsIcon, CheckCircleIcon, DocumentTextIcon } from '../../components/icons/NavIcons';

const PropertyTaxPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { showToast } = useNotifications();
    const [propertyId, setPropertyId] = useState('');
    const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'paid'>('idle');
    const [billData, setBillData] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('searching');
        setTimeout(() => {
            setBillData({
                owner: 'Mohamed Mubasshir',
                address: '12, CM Office Road, Koyambedu, Chennai',
                dueAmount: 4250,
                year: '2024-25',
                zone: 'Zone 10 (Kodambakkam)'
            });
            setStatus('found');
        }, 1500);
    };

    const handlePayment = () => {
        showToast("Processing Secure TN-Gov Gateway...");
        setTimeout(() => setStatus('paid'), 2000);
    };

    return (
        <ServicePageLayout title="Property Tax" subtitle="Corporation of Chennai • Revenue Dept" onBack={onBack}>
            <div className="max-w-md mx-auto space-y-6">
                {status === 'idle' || status === 'searching' ? (
                    <form onSubmit={handleSearch} className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 animate-fadeInUp">
                        <h3 className="font-bold text-gray-800 mb-4">Search Property Details</h3>
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Property ID / Assessment No." 
                                value={propertyId} 
                                onChange={e => setPropertyId(e.target.value)} 
                                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-500 transition-all"
                                required
                            />
                            <button type="submit" disabled={status === 'searching'} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg transition-all flex justify-center items-center">
                                {status === 'searching' ? <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : 'Fetch Bill Details'}
                            </button>
                        </div>
                    </form>
                ) : status === 'found' ? (
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn">
                        <div className="p-6 bg-green-50 border-b border-green-100">
                             <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Bill Found</p>
                             <h3 className="text-2xl font-black text-green-900 mt-1">₹{billData.dueAmount.toLocaleString()}</h3>
                             <p className="text-sm text-green-700">Due for FY {billData.year}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-400 text-sm">Owner</span><span className="font-bold text-gray-800">{billData.owner}</span></div>
                            <div className="flex justify-between border-b pb-2"><span className="text-gray-400 text-sm">Zone</span><span className="font-bold text-gray-800">{billData.zone}</span></div>
                            <div>
                                <span className="text-gray-400 text-sm">Property Address</span>
                                <p className="text-xs font-semibold text-gray-700 mt-1">{billData.address}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t">
                            <button onClick={handlePayment} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg">Pay Securely Now</button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 animate-scaleIn bg-white rounded-3xl shadow-xl p-8 border border-green-100">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold">Tax Paid Successfully</h2>
                        <p className="text-gray-500 mt-2">Ref ID: TXN_TN_{Date.now().toString().slice(-6)}</p>
                        <button className="mt-6 flex items-center justify-center space-x-2 w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-100">
                            <DocumentTextIcon className="w-5 h-5"/>
                            <span>Download E-Receipt</span>
                        </button>
                        <button onClick={onBack} className="mt-3 w-full py-3 text-gray-500 font-semibold">Home</button>
                    </div>
                )}
            </div>
        </ServicePageLayout>
    );
};

export default PropertyTaxPage;
