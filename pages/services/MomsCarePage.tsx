
import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { 
    BabyIcon, 
    BottleIcon, 
    PregnantWomanIcon, 
    LocationMarkerIcon, 
    HeartIcon, 
    ArrowLeftIcon,
    AmbulanceIcon,
    AppleIcon,
    UserGroupIcon,
    CalendarIcon,
    SyringeIcon,
    StethoscopeIcon,
    ClipboardCheckIcon,
    CheckCircleIcon,
    PhoneVibrateIcon,
    XMarkIcon,
    PhoneIcon
} from '../../components/icons/NavIcons';

interface MomsCarePageProps {
    onBack: () => void;
    navigateToMapWithFilter: (filter: string) => void;
}

// --- TYPES ---
interface Appointment {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    status: 'Confirmed' | 'Upcoming';
}

interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    isMe: boolean;
}

// --- MODAL & VISUAL COMPONENTS ---

const ModalWrapper: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-end justify-center animate-fadeIn" onClick={onClose}>
        <div 
            className="bg-white w-full max-w-lg rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slideUpSheet"
            onClick={e => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-bold text-lg text-gray-800">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"><XMarkIcon className="w-5 h-5"/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
                {children}
            </div>
        </div>
    </div>
);

const AppointmentModal: React.FC<{ onClose: () => void; doctorName: string; onBook: (appt: Appointment) => void }> = ({ onClose, doctorName, onBook }) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('Dec 24');
    const [selectedTime, setSelectedTime] = useState('');
    const { showToast } = useNotifications();

    const handleConfirm = () => {
        if(!selectedTime) {
            showToast("Please select a time slot.");
            return;
        }
        const newAppt: Appointment = {
            id: Date.now(),
            title: 'Consultation',
            date: selectedDate,
            time: selectedTime,
            location: 'City Maternity Center',
            status: 'Confirmed'
        };
        onBook(newAppt);
        setStep(2);
        showToast("Appointment booked successfully!");
        setTimeout(() => onClose(), 2000);
    };

    return (
        <ModalWrapper onClose={onClose} title={`Book Appointment`}>
            {step === 1 ? (
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-xl border border-pink-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-600 shadow-sm"><StethoscopeIcon /></div>
                        <div>
                            <p className="font-bold text-gray-800">{doctorName}</p>
                            <p className="text-xs text-gray-500">Senior Gynecologist</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-3">Select Date</h4>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {['Dec 24', 'Dec 25', 'Dec 26'].map(date => (
                                <button 
                                    key={date}
                                    onClick={() => setSelectedDate(date)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors ${selectedDate === date ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    {date}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-3">Available Slots</h4>
                        <div className="grid grid-cols-3 gap-3">
                            {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map(time => (
                                <button 
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2 rounded-lg border text-xs font-medium transition-colors ${selectedTime === time ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button onClick={handleConfirm} className="w-full py-3.5 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 shadow-lg shadow-pink-200">Confirm Booking</button>
                </div>
            ) : (
                 <div className="text-center py-12 flex flex-col items-center animate-scaleIn">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <CheckCircleIcon className="w-12 h-12"/>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h3>
                    <p className="text-gray-600 mt-2">Your appointment is set for {selectedDate} at {selectedTime}.</p>
                </div>
            )}
        </ModalWrapper>
    );
};

const VaccinationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <ModalWrapper onClose={onClose} title="Vaccination Schedule">
        <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center"><CheckCircleIcon /></div>
                <div><p className="font-bold text-gray-800">Tetanus Toxoid (TT) - Dose 1</p><p className="text-xs text-gray-600 mt-1">Completed on: Oct 15, 2024</p></div>
            </div>
             <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center"><CalendarIcon className="w-6 h-6" /></div>
                <div><p className="font-bold text-gray-800">Tetanus Toxoid (TT) - Dose 2</p><p className="text-xs text-gray-600 mt-1">Due on: Jan 05, 2025</p></div>
            </div>
             <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center"><SyringeIcon className="w-6 h-6" /></div>
                <div><p className="font-bold text-gray-800">Flu Shot (Influenza)</p><p className="text-xs text-gray-600 mt-1">Recommended in: 3rd Trimester</p></div>
            </div>
        </div>
    </ModalWrapper>
);

const NutritionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <ModalWrapper onClose={onClose} title="Nutrition Guide">
        <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center mb-2 text-green-800">
                    <AppleIcon className="w-5 h-5 mr-2" />
                    <h4 className="font-bold">Today's Focus: Iron & Calcium</h4>
                </div>
                <p className="text-sm text-gray-600">Your baby needs these for strong bones and blood supply.</p>
            </div>
            
            <div className="space-y-3">
                <h4 className="font-bold text-gray-800 px-1">Meal Plan</h4>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border">8:00 AM</div>
                    <div><p className="font-semibold text-sm text-gray-800">Breakfast</p><p className="text-xs text-gray-500">Oats with fruits, nuts & milk</p></div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border">1:00 PM</div>
                    <div><p className="font-semibold text-sm text-gray-800">Lunch</p><p className="text-xs text-gray-500">Roti, Dal, Spinach Curry & Curd</p></div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs font-bold bg-white px-2 py-1 rounded shadow-sm border">4:00 PM</div>
                    <div><p className="font-semibold text-sm text-gray-800">Snack</p><p className="text-xs text-gray-500">Sprouts Salad / Roasted Chana</p></div>
                </div>
            </div>
        </div>
    </ModalWrapper>
);

const CommunityModal: React.FC<{ onClose: () => void, messages: ChatMessage[], onSend: (text: string) => void }> = ({ onClose, messages, onSend }) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if(!input.trim()) return;
        onSend(input);
        setInput('');
    };

    return (
        <ModalWrapper onClose={onClose} title="Chennai Mom's Circle">
            <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1" ref={scrollRef}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isMe ? 'bg-pink-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                {!msg.isMe && <p className="text-[10px] font-bold text-pink-600 mb-1">{msg.sender}</p>}
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex space-x-2 pt-2 border-t border-gray-100">
                    <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..." 
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-pink-500 outline-none text-sm" 
                    />
                    <button onClick={handleSend} className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-700 transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 transform rotate-180" />
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};


const BubbleBackground: React.FC = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <style>{`
            @keyframes float-up {
                0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
                50% { opacity: 0.6; }
                100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
            }
            .bubble {
                position: absolute;
                background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 192, 203, 0.4));
                border-radius: 50%;
                box-shadow: 0 4px 10px rgba(255, 105, 180, 0.1);
                animation: float-up linear infinite;
            }
        `}</style>
        {[...Array(15)].map((_, i) => (
            <div
                key={i}
                className="bubble"
                style={{
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 60 + 20}px`,
                    height: `${Math.random() * 60 + 20}px`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                    animationDelay: `${Math.random() * 5}s`,
                }}
            />
        ))}
    </div>
);

const EmergencyMode: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
    const [status, setStatus] = useState('Detecting location...');
    const [step, setStep] = useState(1);

    useEffect(() => {
        const timers = [
            setTimeout(() => { setStatus('Alerting Emergency Contacts...'); setStep(2); }, 2000),
            setTimeout(() => { setStatus('Connecting to nearest Ambulance...'); setStep(3); }, 4500),
            setTimeout(() => { setStatus('Ambulance Dispatched (ETA: 8 mins)'); setStep(4); }, 7000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-rose-600 text-white flex flex-col items-center justify-center p-6 animate-scaleIn">
             <div className="absolute inset-0 z-0 bg-rose-600 animate-pulse-sos"></div>
             <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl animate-bounce">
                    <AmbulanceIcon className="w-16 h-16 text-rose-600" />
                </div>
                <h2 className="text-4xl font-black mb-2 text-center tracking-tight">EMERGENCY MODE</h2>
                <p className="text-rose-100 mb-8 text-center max-w-xs font-medium">Stay calm. Help is arriving.</p>
                
                <div className="w-full max-w-sm space-y-6 mb-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
                    <div className={`flex items-center space-x-4 transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-4'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step > 1 ? 'bg-white text-rose-600 border-white' : 'border-white text-white'} `}>
                            {step > 1 ? '✓' : '1'}
                        </div>
                        <span className="font-semibold text-lg">Sharing Live Location</span>
                    </div>
                    <div className={`flex items-center space-x-4 transition-all duration-500 ${step >= 2 ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-4'}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step > 2 ? 'bg-white text-rose-600 border-white' : 'border-white text-white'} `}>
                            {step > 2 ? '✓' : '2'}
                        </div>
                        <span className="font-semibold text-lg">Alerting Family</span>
                    </div>
                    <div className={`flex items-center space-x-4 transition-all duration-500 ${step >= 3 ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-4'}`}>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold ${step > 3 ? 'bg-white text-rose-600 border-white' : 'border-white text-white'} `}>
                            {step > 3 ? '✓' : '3'}
                        </div>
                        <span className="font-semibold text-lg">Hospital Notified</span>
                    </div>
                </div>

                <div className="text-2xl font-bold mb-12 animate-pulse text-center min-h-[2em]">{status}</div>

                <button onClick={onCancel} className="w-full max-w-xs px-8 py-4 bg-white text-rose-600 rounded-full font-extrabold text-lg shadow-lg hover:bg-gray-100 transition-all transform active:scale-95 flex items-center justify-center space-x-2">
                    <XMarkIcon className="w-6 h-6" />
                    <span>I'M SAFE (CANCEL)</span>
                </button>
            </div>
        </div>
    );
};

// FIX: Removed invalid 'className' property from React.cloneElement calls.
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; color: string; onClick?: () => void }> = ({ icon, title, subtitle, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`relative overflow-hidden p-4 rounded-2xl bg-white shadow-sm border border-pink-100 text-left group hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
    >
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { })}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color} text-white shadow-md`}>
            {React.cloneElement(icon as React.ReactElement, { })}
        </div>
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>
    </button>
);

const DoctorCard: React.FC<{ name: string; role: string; onClick: () => void }> = ({ name, role, onClick }) => (
    <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-pink-600 overflow-hidden">
                <img src="https://picsum.photos/seed/doctor-female/200" alt="Doctor" className="w-full h-full object-cover" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wide">My Doctor</p>
                <h3 className="font-bold text-gray-800">{name}</h3>
                <p className="text-xs text-gray-500">{role}</p>
            </div>
        </div>
        <button onClick={onClick} className="px-4 py-2 bg-pink-600 text-white text-xs font-bold rounded-full hover:bg-pink-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105">
            Book
        </button>
    </div>
);

const ScheduleCard: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    return (
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center">
                <ClipboardCheckIcon className="w-5 h-5 mr-2 text-teal-500"/> Upcoming Schedule
            </h3>
            
            <div className="space-y-0 divide-y divide-pink-50">
                {appointments.map(appt => {
                    const [month, day] = appt.date.split(' ');
                    return (
                        <div key={appt.id} className="flex items-start space-x-3 py-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-700 border border-blue-100">
                                <span className="text-[10px] font-bold uppercase">{month}</span>
                                <span className="text-lg font-bold leading-none">{day}</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{appt.title}</p>
                                <p className="text-xs text-gray-500">{appt.time} • {appt.location}</p>
                                <span className={`inline-flex items-center mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${appt.status === 'Confirmed' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                                    {appt.status === 'Confirmed' && <CheckCircleIcon className="w-3 h-3 mr-1"/>} {appt.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Component ---

const MomsCarePage: React.FC<MomsCarePageProps> = ({ onBack, navigateToMapWithFilter }) => {
    const [isEmergency, setIsEmergency] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: 1, title: 'Routine Growth Scan', date: 'Jan 05', time: '10:00 AM', location: 'City Maternity Center', status: 'Upcoming' }
    ]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 1, sender: 'Priya', text: 'Has anyone tried prenatal yoga at the community center?', isMe: false },
        { id: 2, sender: 'Anitha', text: 'Yes! I go every Tuesday. It helps a lot with back pain.', isMe: false },
        { id: 3, sender: 'Me', text: 'That sounds great, I might join next week!', isMe: true },
    ]);

    // Mock Data
    const babyWeek = 24;
    const babySizeFruit = "Papaya";
    const doctorName = "Dr. Anitha S";

    const handleEmergencyTrigger = () => {
        if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
        setIsEmergency(true);
    };

    // Triple Tap Detection Logic (Heuristic)
    useEffect(() => {
        let tapCount = 0;
        let lastTapTime = 0;
        
        // 1. Screen Triple Tap Listener
        const handleScreenClick = () => {
            const now = Date.now();
            if (now - lastTapTime < 400) {
                tapCount++;
            } else {
                tapCount = 1;
            }
            lastTapTime = now;
            if (tapCount === 3) {
                handleEmergencyTrigger();
                tapCount = 0;
            }
        };

        // 2. Back Tap / Shake Listener (Experimental)
        const handleMotion = (event: DeviceMotionEvent) => {
            const acc = event.acceleration;
            if (!acc) return;
            
            // Z-axis spike usually indicates a tap on the back or face of the phone
            if (acc.z && Math.abs(acc.z) > 8) { 
                const now = Date.now();
                if (now - lastTapTime > 150 && now - lastTapTime < 600) { // Debounce and interval check
                    tapCount++;
                } else if (now - lastTapTime > 600) {
                    tapCount = 1;
                }
                lastTapTime = now;

                if (tapCount >= 3) {
                    handleEmergencyTrigger();
                    tapCount = 0;
                }
            }
        };

        window.addEventListener('click', handleScreenClick);
        window.addEventListener('devicemotion', handleMotion);
        
        return () => {
            window.removeEventListener('click', handleScreenClick);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    const handleBookAppointment = (appt: Appointment) => {
        setAppointments(prev => [appt, ...prev].sort((a, b) => a.id - b.id));
    };

    const handleSendMessage = (text: string) => {
        const newMsg = { id: Date.now(), sender: 'Me', text, isMe: true };
        setChatMessages(prev => [...prev, newMsg]);
        
        // Simulate reply
        setTimeout(() => {
            setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'Dr. Bot', text: 'The community is here to support you! Let us know if you need medical advice.', isMe: false }]);
        }, 2000);
    };
    
    return (
        <div className="relative min-h-full bg-gradient-to-br from-rose-50 via-white to-pink-100 overflow-hidden flex flex-col font-sans">
            {isEmergency && <EmergencyMode onCancel={() => setIsEmergency(false)} />}
            {activeModal === 'appointment' && <AppointmentModal onClose={() => setActiveModal(null)} doctorName={doctorName} onBook={handleBookAppointment} />}
            {activeModal === 'vaccination' && <VaccinationModal onClose={() => setActiveModal(null)} />}
            {activeModal === 'nutrition' && <NutritionModal onClose={() => setActiveModal(null)} />}
            {activeModal === 'community' && <CommunityModal onClose={() => setActiveModal(null)} messages={chatMessages} onSend={handleSendMessage} />}
            
            <BubbleBackground />
            
            <header className="relative z-10 flex items-center justify-between p-4 bg-white/70 backdrop-blur-md border-b border-pink-100 sticky top-0 shadow-sm">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 mr-2 -ml-2 text-gray-600 hover:bg-pink-100 rounded-full transition-colors">
                        <ArrowLeftIcon />
                    </button>
                    <div>
                        <h1 className="text-lg font-extrabold text-gray-800 tracking-tight leading-none">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">MOM'S CARE</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-medium tracking-wide">CITIZEN HUB SUITE</p>
                    </div>
                </div>
                <button onClick={() => setActiveModal('community')} className="relative p-2 bg-white rounded-full shadow-sm text-pink-500">
                    <UserGroupIcon className="w-6 h-6"/>
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </button>
            </header>

            <main className="relative z-10 flex-1 p-4 overflow-y-auto space-y-6 pb-24">

                {/* Emergency Trigger Area */}
                <div className="flex flex-col items-center py-4">
                     <button 
                        onClick={handleEmergencyTrigger}
                        className="relative w-48 h-48 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-[0_15px_40px_rgba(244,63,94,0.5)] flex flex-col items-center justify-center text-white transform transition-transform active:scale-95 hover:scale-105 border-4 border-white/50 ring-4 ring-pink-200"
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" style={{animationDuration: '2s'}}></div>
                        <HeartIcon className="w-12 h-12 mb-2 animate-pulse" />
                        <span className="text-2xl font-black tracking-tight">I'M IN PAIN</span>
                        <span className="text-[10px] opacity-90 mt-1 bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">Tap for Help</span>
                    </button>
                    <div className="mt-4 flex items-center space-x-2 text-rose-800/70 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 shadow-sm">
                        <PhoneVibrateIcon className="w-4 h-4 animate-pulse"/>
                        <span className="text-xs font-semibold">Triple Tap Screen or Phone Back for SOS</span>
                    </div>
                </div>

                {/* NEW HIGHLIGHTED SECTION: Breastfeeding Finder */}
                <div onClick={() => navigateToMapWithFilter('Breastfeeding Room')} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 p-1 shadow-lg cursor-pointer transform transition hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-white/10 opacity-50 pattern-dots"></div>
                    <div className="relative flex items-center justify-between bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-pink-500 shadow-md">
                                <BottleIcon className="h-6 w-6" />
                            </div>
                            <div className="text-white">
                                <h3 className="text-lg font-bold leading-tight">Find Feeding Centers</h3>
                                <p className="text-xs font-medium text-pink-100">Locate hygienic & private spaces nearby</p>
                            </div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                             <LocationMarkerIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-gray-800 text-lg">My Medical Team</h3>
                        <span className="text-xs text-pink-600 font-bold bg-pink-100 px-2 py-1 rounded-lg">Live Support</span>
                    </div>
                    <DoctorCard name={doctorName} role="Senior Gynecologist" onClick={() => setActiveModal('appointment')} />
                    <ScheduleCard appointments={appointments} />
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center">
                                <BabyIcon className="w-4 h-4 mr-1"/> Baby Growth
                            </p>
                            <h3 className="text-2xl font-bold text-gray-800">Week {babyWeek}</h3>
                        </div>
                         <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium">Size of a</p>
                            <p className="text-xl font-bold text-gray-700">{babySizeFruit}</p>
                        </div>
                    </div>
                    
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-300 to-rose-400 rounded-full shadow-sm" style={{width: `${(babyWeek/40)*100}%`}}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                        <span>Week 1</span>
                        <span>Week 40</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-800 mb-4 px-1 text-lg">Care Suite</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FeatureCard 
                            icon={<SyringeIcon />} title="Vaccinations" subtitle="Tracker & History" color="bg-purple-500" 
                            onClick={() => setActiveModal('vaccination')} />
                         <FeatureCard 
                            icon={<CalendarIcon />} title="Appointments" subtitle="Manage Visits" color="bg-blue-500" 
                            onClick={() => setActiveModal('appointment')} />
                        <FeatureCard 
                            icon={<AppleIcon />} title="Nutrition" subtitle="Diet Plan" color="bg-green-500" 
                            onClick={() => setActiveModal('nutrition')} />
                         <FeatureCard 
                            icon={<UserGroupIcon />} title="Mom's Circle" subtitle="Community Chat" color="bg-orange-500" 
                            onClick={() => setActiveModal('community')} />
                    </div>
                </div>

                 <div>
                    <h3 className="font-bold text-gray-800 mb-3 px-1 text-lg">Nearby Essentials</h3>
                    <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        <button onClick={() => navigateToMapWithFilter('Hospital')} className="flex-shrink-0 bg-white p-3 rounded-xl border border-pink-100 shadow-sm flex items-center space-x-3 pr-6 min-w-[160px]">
                            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center"><LocationMarkerIcon className="w-5 h-5"/></div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-gray-800">Hospitals</p>
                                <p className="text-xs text-gray-500">Emergency</p>
                            </div>
                        </button>
                        <button onClick={() => navigateToMapWithFilter('Pharmacy')} className="flex-shrink-0 bg-white p-3 rounded-xl border border-pink-100 shadow-sm flex items-center space-x-3 pr-6 min-w-[160px]">
                            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center"><StethoscopeIcon className="w-5 h-5"/></div>
                            <div className="text-left">
                                <p className="font-bold text-sm text-gray-800">Pharmacy</p>
                                <p className="text-xs text-gray-500">Medicine</p>
                            </div>
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default MomsCarePage;
