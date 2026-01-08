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
                if (typeof MediaRecorder === 'undefined') {
                    showToast("Video recording is not supported.");
                    setRecordingState('finished');
                    onActivateRef.current('');
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
            showToast("Camera access failed. SOS active without video.");
            if(isRecording) {
                setRecordingState('finished');
                onActivateRef.current('');
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
            startCamera(true);
            
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
        }, 1000);
    };

    const handleMouseUp = () => {
        if (sosState === 'holding') {
            setSosState('idle');
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        }
    };

    const handleImSafe = () => {
        stopCamera();
        showToast("SOS deactivated.");
        onClose();
    };

    const renderActivatedContent = () => {
        switch (recordingState) {
            case 'recording':
                return (
                    <div className="z-20 text-center animate-fadeIn">
                        <div className="relative inline-block mb-6">
                            <div className="w-12 h-12 bg-red-500 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute inset-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center border-4 border-white">
                                <div className="w-4 h-4 bg-white rounded-sm"></div>
                            </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter">SOS ACTIVE</h1>
                        <p className="mt-2 text-3xl font-mono bg-black/40 px-4 py-1 rounded-lg inline-block border border-white/20">{recordingCountdown}s</p>
                        <p className="text-sm mt-3 font-semibold opacity-80">Location being shared with authorities...</p>
                    </div>
                );
            case 'processing':
                return (
                    <div className="z-20 text-center">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
                        <h1 className="text-3xl font-black">UPLOADING FEED...</h1>
                    </div>
                );
            case 'finished':
                return (
                    <div className="z-20 text-center animate-scaleIn">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white">
                            <span className="text-4xl">✓</span>
                        </div>
                        <h1 className="text-3xl font-black">ALERT SENT</h1>
                        <p className="mt-2 font-bold text-rose-100">Live feed active. Emergency services notified.</p>
                    </div>
                );
            default: return null;
        }
    }


    const renderContent = () => {
        if (sosState === 'activated') {
            return (
                <div className="relative w-full h-full flex flex-col items-center justify-between text-white p-8 bg-red-900">
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"></video>
                    <div className="absolute inset-0 w-full h-full bg-black/40 z-10"></div>
                    
                    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
                        {renderActivatedContent()}
                    </div>
                    
                    <button 
                        onClick={handleImSafe} 
                        className="relative z-20 w-full max-w-sm py-5 px-4 text-black font-black text-xl rounded-2xl bg-white shadow-2xl transform active:scale-95 transition-all"
                    >
                        {t('imSafe')}
                    </button>
                </div>
            );
        }
        
        const isHolding = sosState === 'holding' || sosState === 'countdown';

        return (
            <div 
                className="w-full h-full flex flex-col items-center justify-center text-center p-8 text-white relative overflow-hidden"
                onMouseUp={handleMouseUp}
                onTouchEnd={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                 <div className="kolam-overlay opacity-10 scale-150"></div>
                 <button
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full border-8 border-white/20 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 focus:outline-none bg-red-600/30 backdrop-blur-md"
                >
                    <div className={`absolute top-0 left-0 w-full h-full rounded-full border-4 border-white transition-transform duration-1000 ease-linear ${isHolding ? 'scale-125 opacity-0' : 'scale-100 opacity-50'}`} style={{animation: isHolding ? 'pulse-sos-button 2s infinite' : 'none'}}></div>
                    {sosState === 'countdown' ? (
                        <span className="text-8xl font-black drop-shadow-xl">{countdown}</span>
                    ) : (
                        <>
                            <span className="text-5xl font-black tracking-tighter drop-shadow-lg">{t('sos')}</span>
                            <span className="text-xs mt-2 font-bold uppercase tracking-widest opacity-80">{t('holdForEmergency')}</span>
                        </>
                    )}
                </button>
                <button onClick={onClose} className="absolute bottom-10 text-white/60 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors z-20">
                    {t('cancel')}
                </button>
            </div>
        );
    };

    return (
        <div 
            className={`fixed inset-0 z-[100] transition-colors duration-500 ${sosState === 'activated' ? 'bg-red-800' : 'bg-slate-900/95 backdrop-blur-xl'}`}
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