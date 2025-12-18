import React, { useEffect } from 'react';
import { TransportIcon, MedicalHelpIcon, WaterPowerIcon } from './icons/NavIcons';

interface ServiceTransitionProps {
    serviceKey: string;
    onTransitionEnd: () => void;
}

const TRANSITION_DURATION = 1400;

const ServiceTransition: React.FC<ServiceTransitionProps> = ({ serviceKey, onTransitionEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onTransitionEnd, TRANSITION_DURATION);
        return () => clearTimeout(timer);
    }, [onTransitionEnd]);

    const renderAnimation = () => {
        switch (serviceKey) {
            case 'transportInfo':
            case 'metroCardRecharge':
            case 'parkingFinder':
                return (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-1 bg-gray-600">
                             <div className="absolute top-1/2 left-0 -translate-y-1/2 animate-drive-by">
                                <TransportIcon className="w-16 h-16 text-yellow-300 transform -scale-x-100" />
                            </div>
                        </div>
                    </div>
                );
            case 'medicalHelp':
            case 'findBloodBanks':
            case 'bookVaccination':
            case 'emergencyAmbulance':
                 return (
                    <div className="w-full h-full bg-red-800 flex items-center justify-center">
                        <div className="relative w-64 h-32">
                             <svg viewBox="0 0 200 80" className="w-full h-full">
                                <path d="M0 40 L30 40 L40 20 L50 60 L60 30 L70 45 L80 40 L200 40" stroke="#f87171" strokeWidth="4" fill="none" className="animate-ecg-pulse" />
                            </svg>
                             <MedicalHelpIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white animate-pulse" />
                        </div>
                    </div>
                );
            case 'waterPower':
            case 'newConnection':
            case 'wasteTracker':
                 return (
                    <div className="w-full h-full bg-blue-700 flex items-center justify-center overflow-hidden">
                        <div className="relative w-24 h-24">
                            <WaterPowerIcon className="w-24 h-24 text-blue-300 animate-water-drop" />
                        </div>
                    </div>
                );
            default:
                // Generic fallback transition
                return (
                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-t-teal-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 z-[100]">
            {renderAnimation()}
        </div>
    );
};

export default ServiceTransition;