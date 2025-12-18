import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import ServicePageLayout from './ServicePageLayout';
import { useNotifications } from '../../contexts/NotificationsContext';
import { SearchIcon } from '../../components/icons/NavIcons';

interface TransportInfoPageProps {
  onBack: () => void;
}

const LocationCard: React.FC<{ name: string; image: string }> = ({ name, image }) => (
    <div className="flex-shrink-0 w-40 cursor-pointer snap-start group">
        <img src={image} alt={name} className="w-full h-28 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow" />
        <p className="mt-2 font-semibold text-sm text-center text-gray-800 break-words">{name}</p>
    </div>
);

const TransportInfoPage: React.FC<TransportInfoPageProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const { showToast } = useNotifications();

    const popularPlaces = [
        { name: 'Chennai International Airport', image: 'https://picsum.photos/seed/chennaiairport/400/300' },
        { name: 'Chennai Central Railway Station', image: 'https://picsum.photos/seed/chennaistation/400/300' },
        { name: 'T. Nagar Shopping District', image: 'https://picsum.photos/seed/tnagar/400/300' },
        { name: 'Marina Beach', image: 'https://picsum.photos/seed/marinabeach/400/300' },
        { name: 'Guindy National Park', image: 'https://picsum.photos/seed/guindypark/400/300' },
    ];

    return (
        <ServicePageLayout
            title={t('transportInfo')}
            subtitle={t('transportInfoDesc')}
            onBack={onBack}
        >
            <div className="space-y-8">
                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter pickup location"
                        className="w-full bg-gray-100 border-2 border-gray-200/60 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    />
                </div>

                {/* Services Grid Section */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Everything In Minutes</h2>
                    <div className="flex gap-4">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-4 w-1/2">
                            <div 
                                onClick={() => showToast('Parcel service coming soon!')}
                                className="relative bg-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition-shadow overflow-hidden h-40 flex flex-col justify-between"
                            >
                                <img src="https://picsum.photos/seed/sweetbox/200/200" className="absolute top-0 right-0 h-24 w-24 object-cover opacity-20 -mr-8 -mt-4" alt=""/>
                                <div>
                                    <p className="text-sm text-gray-500">Send anything</p>
                                    <h3 className="text-xl font-bold text-gray-900">Parcel</h3>
                                </div>
                            </div>
                             <div 
                                onClick={() => showToast('Ride booking coming soon!')}
                                className="bg-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition-shadow flex flex-col justify-between h-48"
                            >
                                <div>
                                    <p className="text-sm text-gray-500">Your everyday rides</p>
                                    <h3 className="text-xl font-bold text-gray-900">Book now</h3>
                                </div>
                                <img src="https://picsum.photos/seed/autorickshaw/300/100" className="w-full object-contain self-end" alt="Rides"/>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col gap-4 w-1/2">
                             <div 
                                onClick={() => showToast('Metro ticket booking coming soon!')}
                                className="relative bg-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition-shadow overflow-hidden h-48 flex flex-col justify-between"
                            >
                                <div>
                                    <p className="text-sm text-gray-500">Introducing</p>
                                    <h3 className="text-xl font-bold text-gray-900">Metro tickets</h3>
                                </div>
                                <img src="https://picsum.photos/seed/metroticket/300/100" className="w-full object-contain self-end" alt="Metro Tickets"/>
                            </div>
                            <div 
                                onClick={() => showToast('More services coming soon!')}
                                className="bg-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition-shadow flex flex-col justify-between h-40"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">All Services</h3>
                                </div>
                                <div className="self-end">
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <div className="w-5 h-5 bg-gray-300 rounded-md"></div>
                                        <div className="w-5 h-5 bg-yellow-400 rounded-md"></div>
                                        <div className="w-5 h-5 bg-gray-300 rounded-md"></div>
                                        <div className="w-5 h-5 bg-gray-300 rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Promo Banner */}
                <section>
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between overflow-hidden">
                        <div className="flex-1 pr-2">
                             <h3 className="font-bold text-gray-900">Pay the lowest price on Cab rides. Pakka!</h3>
                             <p className="text-sm text-gray-500 mt-1">Try UNIFIED Economy</p>
                        </div>
                        <img src="https://picsum.photos/seed/cab/200/100" alt="Cab" className="w-28 h-auto object-contain flex-shrink-0 -mr-4" />
                    </div>
                </section>

                {/* Go Places Section */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Go Places with UNIFIED</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
                        {popularPlaces.map(place => (
                            <LocationCard key={place.name} name={place.name} image={place.image} />
                        ))}
                    </div>
                </section>
            </div>
        </ServicePageLayout>
    );
};

export default TransportInfoPage;