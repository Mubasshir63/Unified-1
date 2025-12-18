
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationsContext';
import { useTranslation } from '../hooks/useTranslation';
import type { SOSState } from '../types';

interface SOSModalProps {
    onClose: () => void;
    initialState?: SOSState;
    onActivate: (videoDataUrl: string) => void;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'finished';
const RECORDING_DURATION = 60; // 60 seconds

const SOSModal: React.FC<SOSModalProps> = ({ onClose, initialState = 'idle', onActivate }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();
    const [sosState, setSosState] = useState<SOSState>(initialState);
    const [countdown, setCountdown] = useState(3);
    const [recordingCountdown, setRecordingCountdown] = useState(RECORDING_DURATION);
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    
    const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    const onActivateRef = useRef(onActivate);
	onActivateRef.current = onActivate;

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);
    
    const startCamera = useCallback(async (isRecording: boolean) => {
        stopCamera();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }, 
                audio: true 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            if (isRecording) {
                recordedChunksRef.current = [];
                // Check if MediaRecorder is available
                if (typeof MediaRecorder === 'undefined') {
                    showToast("Video recording is not supported on this browser.");
                    setRecordingState('finished'); // Skip recording
                    onActivateRef.current(''); // Activate with no video
                    return;
                }
                
                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunksRef.current.push(event.data);
                    }
                };
                mediaRecorderRef.current.onstop = () => {
                    setRecordingState('processing');
                    const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        onActivateRef.current(reader.result as string);
                        setRecordingState('finished');
                    };
                    reader.readAsDataURL(videoBlob);
                };
                mediaRecorderRef.current.start();
            }
        } catch (err) {
            console.error("Error accessing camera/mic:", err);
            showToast("Could not access camera/mic. SOS active without video.");
            if(isRecording) {
                setRecordingState('finished'); // Skip recording
                onActivateRef.current(''); // Activate with no video
            }
        }
    }, [showToast, stopCamera]);

    useEffect(() => {
        if (initialState === 'countdown' || sosState === 'countdown') {
            setCountdown(3);
            countdownIntervalRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current!);
                        setSosState('activated');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current) };
    }, [initialState, sosState === 'countdown']);


    useEffect(() => {
        if (sosState === 'activated') {
            setRecordingState('recording');
            setRecordingCountdown(RECORDING_DURATION);
            startCamera(true); // Start camera and recording
            
            recordingIntervalRef.current = setInterval(() => {
                setRecordingCountdown(prev => prev - 1);
            }, 1000);

            const recordingTimeout = setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
                if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
            }, RECORDING_DURATION * 1000);

            return () => {
                clearTimeout(recordingTimeout);
                if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
            }
        }
    }, [sosState, startCamera]);


    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopCamera();
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [stopCamera]);


    const handleMouseDown = () => {
        if (sosState !== 'idle') return;
        setSosState('holding');
        holdTimeoutRef.current = setTimeout(() => {
            setSosState('countdown');
        }, 1000); // 1 second hold to start countdown
    };

    const handleMouseUp = () => {
        if (sosState === 'holding') {
            setSosState('idle');
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        }
    };

    const handleImSafe = () => {
        stopCamera();
        showToast("SOS has been deactivated.");
        onClose();
    };

    const renderActivatedContent = () => {
        switch (recordingState) {
            case 'recording':
                return (
                    <div className="z-20 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <h1 className="text-3xl font-bold">RECORDING</h1>
                        <p className="mt-2 text-2xl font-mono">{recordingCountdown}s</p>
                        <p className="text-sm mt-1">A 1-minute video is being recorded and sent.</p>
                    </div>
                );
            case 'processing':
                return (
                    <div className="z-20 text-center">
                        <div className="w-8 h-8 border-4 border-white/50 border-t-white rounded-full animate-spin mb-4"></div>
                        <h1 className="text-3xl font-bold">Processing & Sending...</h1>
                    </div>
                );
            case 'finished':
                return (
                    <div className="z-20 text-center">
                        <h1 className="text-3xl font-bold">Recording Sent</h1>
                        <p className="mt-2">Live feed is active. Emergency contacts are being alerted.</p>
                    </div>
                );
            default: return null;
        }
    }


    const renderContent = () => {
        if (sosState === 'activated') {
            return (
                <div className="relative w-full h-full flex flex-col items-center justify-between text-white p-8">
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover z-0"></video>
                    <div className="absolute inset-0 w-full h-full bg-black/60 z-10"></div>
                    
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
                        {renderActivatedContent()}
                    </div>
                    
                    <button 
                        onClick={handleImSafe} 
                        className="relative z-20 w-full max-w-sm py-4 px-4 text-black font-bold text-xl rounded-2xl bg-white/90 hover:bg-white transition-transform shadow-lg"
                    >
                        {t('imSafe')}
                    </button>
                </div>
            );
        }
        
        const isHolding = sosState === 'holding' || sosState === 'countdown';

        return (
            <div 
                className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-white"
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                 <button
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-white/50 flex flex-col items-center justify-center transition-transform duration-200 active:scale-95 focus:outline-none"
                >
                    <div className={`absolute top-0 left-0 w-full h-full rounded-full border-4 border-white transition-transform duration-1000 ease-linear ${isHolding ? 'scale-125 opacity-0' : 'scale-100 opacity-50'}`} style={{animation: isHolding ? 'pulse-sos-button 2s infinite' : 'none'}}></div>
                    {sosState === 'countdown' ? (
                        <span className="text-7xl font-bold">{countdown}</span>
                    ) : (
                        <>
                            <span className="text-4xl font-bold">{t('sos')}</span>
                            <span className="text-sm mt-1">{t('holdForEmergency')}</span>
                        </>
                    )}
                </button>
                <button onClick={onClose} className="absolute bottom-8 text-white/70 hover:text-white font-semibold">
                    {t('cancel')}
                </button>
            </div>
        );
    };

    return (
        <div 
            className={`fixed inset-0 z-[100] transition-colors duration-500 ${sosState === 'activated' ? 'bg-red-800' : 'bg-black/80 backdrop-blur-sm'}`}
        >
             <style>{`
                @keyframes pulse-sos-button {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1.2); opacity: 0; }
                }
             `}</style>
            {renderContent()}
        </div>
    );
};

export default SOSModal;