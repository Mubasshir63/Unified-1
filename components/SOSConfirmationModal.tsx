import React, { useState, useEffect, useRef } from 'react';

interface SOSConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const SOSConfirmationModal: React.FC<SOSConfirmationModalProps> = ({ onConfirm, onCancel }) => {
    const [countdown, setCountdown] = useState(5);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    onConfirm();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [onConfirm]);

    const handleCancel = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] flex flex-col items-center justify-center p-4">
             <style>{`
                @keyframes pulse-confirm {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                    }
                    70% {
                        transform: scale(1.1);
                        box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
                    }
                }
             `}</style>
            <div className="text-center text-white">
                <div 
                    className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-red-500/50 flex flex-col items-center justify-center animate-pulse-sos"
                >
                    <span className="text-7xl font-bold">{countdown}</span>
                </div>
                <h1 className="text-3xl font-bold mt-8">Confirming SOS</h1>
                <p className="mt-2 text-white/80">Activating emergency alert unless cancelled.</p>

                <button 
                    onClick={handleCancel}
                    className="w-full max-w-sm py-4 px-4 text-black font-bold text-xl rounded-2xl bg-white/90 hover:bg-white transition-transform shadow-lg mt-12"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default SOSConfirmationModal;