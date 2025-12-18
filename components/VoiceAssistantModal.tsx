import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: The 'LiveSession' type is not exported from the library.
import { GoogleGenAI, LiveServerMessage, Blob, FunctionDeclaration, Type, Modality } from '@google/genai';
import { XMarkIcon, MicrophoneIcon } from './icons/NavIcons';
import { Page } from '../types';

// From Live API guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const serviceKeys = [
    'fileNewReport', 'medicalHelp', 'waterPower', 'transportInfo', 'wasteTracker', 'localEvents', 'volunteer', 'downloadCenter', 'govtSchemes', 'legalHelp', 'complaintRegistration', 'govtPortals', 'aadhaarServices', 'passportSeva', 'findBloodBanks', 'bookVaccination', 'emergencyAmbulance', 'metroCardRecharge', 'parkingFinder', 'newConnection', 'communityCenters', 'propertyTax', 'landRecords', 'schoolAdmissions', 'publicLibraries', 'digitalLocker'
];

interface VoiceAssistantModalProps {
    onClose: () => void;
    onCommand: (command: { action: string; payload: any }) => void;
}

type Status = 'idle' | 'permission' | 'listening' | 'processing' | 'error';

const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ onClose, onCommand }) => {
    const [status, setStatus] = useState<Status>('idle');
    const [transcription, setTranscription] = useState('');
    const [interimTranscription, setInterimTranscription] = useState('');
    
    // FIX: Use Promise<any> as LiveSession is not an exported type.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopListening = useCallback(() => {
        if(scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(console.error);
            audioContextRef.current = null;
        }
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close()).catch(console.error);
            sessionPromiseRef.current = null;
        }
    }, []);

    const startListening = useCallback(async () => {
        stopListening();
        setStatus('listening');
        setTranscription('');
        setInterimTranscription('');
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            const navigateToPage: FunctionDeclaration = {
                name: 'navigateToPage',
                parameters: { type: Type.OBJECT, properties: { page: { type: Type.STRING, enum: Object.values(Page) } }, required: ['page'] }
            };
            const navigateToService: FunctionDeclaration = {
                name: 'navigateToService',
                parameters: { type: Type.OBJECT, properties: { serviceId: { type: Type.STRING, description: `The specific service to navigate to.`, enum: serviceKeys } }, required: ['serviceId'] }
            };
            const search: FunctionDeclaration = {
                name: 'search',
                parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING } }, required: ['query'] }
            };

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        if(!scriptProcessorRef.current) return;
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(audioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                         // FIX: The `isFinal` property does not exist on `inputTranscription`.
                         // Following the API guideline, we append transcription text as it arrives.
                         const text = message.serverContent?.inputTranscription?.text;
                        if (text) {
                            setTranscription(prev => prev + text);
                        }

                        // Handle function calls in real-time
                        if (message.toolCall) {
                            stopListening();
                            const funcCall = message.toolCall.functionCalls[0];
                            if (funcCall) {
                                onCommand({ action: funcCall.name, payload: funcCall.args });
                            }
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setStatus('error');
                        stopListening();
                    },
                    onclose: (e: CloseEvent) => {
                        // Session closed
                    },
                },
                config: {
                    inputAudioTranscription: {},
                    responseModalities: [Modality.AUDIO], // Required by API
                    tools: [{ functionDeclarations: [navigateToPage, navigateToService, search] }],
                    // FIX: The 'systemInstruction' property should be inside the 'config' object.
                    systemInstruction: `You are an app command interpreter for the UNIFIED citizen app. You will ONLY process commands spoken in English or Tamil. Ignore any other language. Your task is to call the correct function with the correct arguments to fulfill the user's command as soon as you understand the intent.
- 'home', 'services', 'map', 'report', 'profile' are pages. For these, call 'navigateToPage'.
- For any other service, call 'navigateToService'. The 'serviceId' MUST be one of the provided enum values. For example, if the user says 'I want to complain' or 'புகார் பதிவு செய்ய வேண்டும்' (I want to register a complaint), call navigateToService with { "serviceId": "complaintRegistration" }.
- If the intent is unclear or doesn't match a page/service, use the 'search' function.`
                },
            });

        } catch (err) {
            console.error("Error getting user media:", err);
            setStatus('error');
        }
    }, [stopListening, onCommand]);


    useEffect(() => {
        setStatus('permission');
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => startListening())
            .catch(err => {
                console.error("Mic permission denied:", err);
                setStatus('error');
            });

        return () => stopListening();
    }, [startListening, stopListening]);
    
    let statusText = "Initializing...";
    switch(status) {
        case 'permission': statusText = "Requesting microphone access..."; break;
        case 'listening': statusText = "Listening... Try saying 'Go to services' or 'புகார் பதிவு செய்ய வேண்டும்'"; break;
        case 'processing': statusText = "Thinking..."; break;
        case 'error': statusText = "Microphone access denied or an error occurred."; break;
    }
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end" onClick={onClose}>
            <div className="bg-white w-full rounded-t-2xl shadow-2xl animate-slideUpSheet" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon /></button>
                
                <div className="h-48 flex flex-col items-center justify-center text-center px-4">
                    {/* Transcription Display */}
                     <p className="min-h-[2.5em] text-2xl font-medium text-gray-800">
                        {transcription}
                        <span className="text-gray-400">{interimTranscription}</span>
                    </p>
                </div>

                <div className="h-24 flex items-center justify-center">
                    {status === 'listening' && (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="voice-dot voice-dot-1"></div>
                            <div className="voice-dot voice-dot-2"></div>
                            <div className="voice-dot voice-dot-3"></div>
                        </div>
                    )}
                    {(status === 'idle' || status === 'permission' || status === 'error' || status === 'processing') && (
                         <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
                           <MicrophoneIcon className="w-8 h-8" />
                        </div>
                    )}
                </div>
                 <p className="text-center text-sm text-gray-500 pb-6 h-6">{statusText}</p>
            </div>
        </div>
    )
};

export default VoiceAssistantModal;