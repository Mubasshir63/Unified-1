import React, { useState, useEffect } from 'react';
import { MicrophoneIcon } from './icons/NavIcons';

interface SecretWordListenerModalProps {
    onCancel: () => void;
    duration: number; // in seconds
}

const SecretWordListenerModal: React.FC<SecretWordListenerModalProps> = ({ onCancel, duration }) => {
    const [countdown, setCountdown] = useState(duration);

    useEffect(() => {
        if (countdown <= 0) {
            return;
        };
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] flex flex-col items-center justify-center p-4 animate-fadeInUp">
            <div className="text-center text-white">
                <div className="relative w-40 h-40 rounded-full border-4 border-white/30 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-pulse-green"></div>
                    <MicrophoneIcon className="w-20 h-20" />
                </div>
                <h1 className="text-3xl font-bold mt-8">Listening...</h1>
                <p className="mt-2 text-white/80">Shake detected. Please say your secret word.</p>
                <p className="mt-4 font-mono text-2xl font-bold">{countdown}</p>
                <button 
                    onClick={onCancel}
                    className="w-full max-w-xs py-3 px-4 text-black font-semibold rounded-2xl bg-white/90 hover:bg-white transition-transform shadow-lg mt-12"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default SecretWordListenerModal;
