import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';

interface LocalEventsPageProps {
  onBack: () => void;
}

type EventCategory = 'All' | 'Cultural' | 'Workshops' | 'Sports' | 'Govt';

const events = [
    { title: 'City Marathon 2024', category: 'Sports', date: 'Dec 15', location: 'City Stadium', image: 'https://picsum.photos/seed/marathon/800/600' },
    { title: 'Annual Handicrafts Fair', category: 'Cultural', date: 'Dec 18-22', location: 'Exhibition Grounds', image: 'https://picsum.photos/seed/handicrafts/800/600' },
    { title: 'Digital Literacy Workshop', category: 'Workshops', date: 'Dec 20', location: 'Community Hall', image: 'https://picsum.photos/seed/workshop/800/600' },
    { title: 'Republic Day Parade Planning', category: 'Govt', date: 'Dec 28', location: 'Town Hall', image: 'https://picsum.photos/seed/parade/800/600' },
];

const FilterChip: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 flex-shrink-0 ${isActive ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'}`}
    >
        {label}
    </button>
);

const EventCard: React.FC<{ event: typeof events[0] }> = ({ event }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();

    const handleRegister = (e: React.MouseEvent) => {
        e.stopPropagation();
        showToast(`Registered for ${event.title}!`);
    };

    return (
        <div className="relative group rounded-2xl w-full h-64 flex flex-col justify-end overflow-hidden shadow-lg border border-gray-200/50 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer text-left">
            <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="relative w-full p-5 text-white">
                <p className="font-bold text-xs uppercase tracking-wider opacity-80">{event.category}</p>
                <h3 className="font-bold text-2xl leading-tight text-shadow">{event.title}</h3>
                <p className="text-sm mt-1">{event.date} &bull; {event.location}</p>
                <button onClick={handleRegister} className="mt-4 px-4 py-2 text-sm font-bold bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors">
                    {t('registerNow')}
                </button>
            </div>
        </div>
    );
};

const LocalEventsPage: React.FC<LocalEventsPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState<EventCategory>('All');
    
    const filteredEvents = events.filter(e => activeFilter === 'All' || e.category === activeFilter);

    return (
        <ServicePageLayout
            title={t('localEvents')}
            subtitle={t('localEventsDesc')}
            onBack={onBack}
        >
             <div className="space-y-6">
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                    <FilterChip label="All" isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
                    <FilterChip label={t('cultural')} isActive={activeFilter === 'Cultural'} onClick={() => setActiveFilter('Cultural')} />
                    <FilterChip label={t('workshops')} isActive={activeFilter === 'Workshops'} onClick={() => setActiveFilter('Workshops')} />
                    <FilterChip label={t('sports')} isActive={activeFilter === 'Sports'} onClick={() => setActiveFilter('Sports')} />
                    <FilterChip label={t('govt')} isActive={activeFilter === 'Govt'} onClick={() => setActiveFilter('Govt')} />
                </div>
                
                <div className="space-y-4">
                    {filteredEvents.map(event => (
                        <EventCard key={event.title} event={event} />
                    ))}
                </div>
            </div>
        </ServicePageLayout>
    );
};

export default LocalEventsPage;