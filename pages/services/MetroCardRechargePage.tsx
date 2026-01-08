
import React, { useState } from 'react';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { TransportIcon, CheckCircleIcon } from '../../components/icons/NavIcons';

const MetroCardRechargePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { showToast } = useNotifications();
    const [cardNumber, setCardNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1);

    const handleProceed = (e: React.FormEvent) => {
        e.preventDefault();
        if (cardNumber.length < 8) {
            showToast("Enter a valid 8-12 digit card number.");
            return;
        }
        setStep(2);
    };

    const handlePayment = () => {
        showToast("Processing payment...");
        setTimeout(() => setStep(3), 2000);
    };

    return (
        <ServicePageLayout title="Metro Smart Recharge" subtitle="Chennai Metro (CMRL) Online Portal" onBack={onBack}>
            <div className="max-w-md mx-auto space-y-6 animate-fadeInUp">
                {/* Virtual Card Preview */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden aspect-[1.58/1] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <span className="font-black italic text-xl tracking-tighter">CMRL SMART</span>
                        <div className="w-10 h-10 bg-yellow-400 rounded-lg"></div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs opacity-60 uppercase font-bold tracking-widest mb-1">Card Number</p>
                        <p className="text-xl font-mono tracking-[0.2em]">{cardNumber.padEnd(12, '•').replace(/(.{4})/g, '$1 ')}</p>
                    </div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleProceed} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                            <input 
                                type="text" 
                                value={cardNumber} 
                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                placeholder="12 Digit Number"
                                className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 transition-all font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Amount (₹)</label>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {[100, 200, 500].map(val => (
                                    <button key={val} type="button" onClick={() => setAmount(String(val))} className={`py-3 rounded-xl border-2 font-bold transition-all ${amount === String(val) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'border-gray-100 text-gray-600 hover:border-blue-200'}`}>₹{val}</button>
                                ))}
                            </div>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)}
                                placeholder="Other Amount"
                                className="w-full p-4 mt-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transform hover:scale-[1.02] active:scale-95 transition-all">
                            Proceed to Pay
                        </button>
                    </form>
                ) : step === 2 ? (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4 animate-scaleIn">
                        <h3 className="font-bold text-lg">Select Payment Method</h3>
                        <div className="space-y-2">
                            {['UPI / GPay', 'Debit Card', 'Net Banking'].map(m => (
                                <button key={m} onClick={handlePayment} className="w-full p-4 text-left border-2 border-gray-100 rounded-xl font-semibold flex justify-between items-center hover:bg-blue-50 hover:border-blue-200 transition-all">
                                    <span>{m}</span>
                                    <span className="text-blue-500">&rarr;</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 animate-scaleIn bg-white rounded-3xl shadow-xl p-8 border border-green-100">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold">Recharge Successful</h2>
                        <p className="text-gray-500 mt-2">₹{amount} added to card {cardNumber.slice(-4)}</p>
                        <button onClick={onBack} className="mt-8 w-full py-3 bg-green-600 text-white font-bold rounded-xl">Back to Services</button>
                    </div>
                )}
            </div>
        </ServicePageLayout>
    );
};

export default MetroCardRechargePage;
