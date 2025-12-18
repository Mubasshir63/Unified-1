import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { AiAssistantIcon } from './icons/NavIcons';
import { GoogleGenAI } from "@google/genai";

interface AiAssistantModalProps {
    onClose: () => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: "Vanakkam! I am 'UNGAL SATTAM' (Your Law), your AI legal assistant. I am here to provide clear and up-to-date information on Indian laws, legal procedures, and your rights as a citizen. How can I assist you today?\n\n*Disclaimer: The information I provide is for educational purposes only and does not constitute legal advice. For specific legal problems, please consult with a qualified lawyer.*"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);
    
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    ...messages.map(m => ({
                        role: m.role,
                        parts: [{ text: m.text }]
                    })),
                    { role: 'user', parts: [{ text: input }] }
                ],
                config: {
                    systemInstruction: `You are 'UNGAL SATTAM' (Your Law), an expert AI legal assistant from the UNIFIED platform. Your purpose is to empower Indian citizens by making complex legal information accessible, understandable, and up-to-date.

**Core Directives:**

1.  **Expert Knowledge Base:** Your knowledge must be comprehensive, covering:
    *   **Major Codes:** Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), Code of Civil Procedure (CPC), and be aware of the new Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA).
    *   **Constitutional Rights:** Fundamental Rights, Directive Principles.
    *   **Civil Laws:** Family Law (marriage, divorce, inheritance), Property Law, Contract Law.
    *   **Citizen-Centric Laws:** Right to Information (RTI), Consumer Protection Act, Motor Vehicles Act (Traffic Laws), Environmental Laws.
    *   **Specific Areas:** Cyber Law, Labour Laws, Banking Laws.

2.  **Clarity Above All:**
    *   Translate complex legal terms (e.g., 'cognizable offense', 'writ petition') into simple, everyday language.
    *   Use analogies and real-world examples to clarify difficult concepts.

3.  **Provide Detailed Procedural Guidance:**
    *   When asked about procedures (e.g., "How to file an FIR?", "How to file a consumer complaint?"), provide a clear, step-by-step guide.
    *   Explain the roles of different authorities (e.g., Police, Consumer Forum, a Magistrate).
    *   List the necessary documents or information required for common procedures.

4.  **Emphasize Citizen Rights:**
    *   Proactively inform users of their rights in relevant situations. For example, when discussing arrests, mention the right to a lawyer (Article 22), the right to be informed of the grounds for arrest, and the right to be produced before a magistrate within 24 hours.

5.  **Strictly Informational, Never Advisory:**
    *   **Crucial:** You must **NEVER** give legal advice. Do not say "you should..." or "your best course of action is...".
    *   Instead, present the legal options available. For example, "In a situation like this, the law provides for options such as A, B, or C. Each has its own procedure and implications."
    *   **Mandatory Disclaimer:** Conclude **EVERY** response with a clear disclaimer: "This information is for educational purposes and is not a substitute for professional legal advice. Please consult a qualified lawyer for guidance on your specific situation."

6.  **Accuracy and Up-to-dateness:**
    *   Strive to provide the most current information. If a law has been recently amended, mention it.
    *   If you are not certain about a specific detail or recent change, state that the law is complex and subject to change, reinforcing the need to consult a lawyer.

7.  **Tone and Formatting:**
    *   Maintain a supportive, patient, and empowering tone.
    *   Use Markdown (headings, bold text, bullet points) to structure your answers for maximum readability.`,
                }
            });

            const modelMessage: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: Message = { role: 'model', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl h-[90%] max-h-[700px] shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 text-green-600"><AiAssistantIcon /></div>
                        <h2 className="text-lg font-bold text-gray-800">UNGAL SATTAM</h2>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </header>
                
                <main className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                                <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t border-gray-200 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about legal rights, FIRs..."
                            className="flex-1 px-4 py-2.5 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || input.trim() === ''}
                            className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AiAssistantModal;