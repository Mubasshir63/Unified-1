
import React, { useState, useEffect } from 'react';
import ServicePageLayout from './ServicePageLayout';
import { ParkingIcon, LocationMarkerIcon, CheckCircleIcon } from '../../components/icons/NavIcons';

const ParkingFinderPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [loading, setLoading] = useState(true);
    const [spots, setSpots] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setSpots([
                { name: 'Koyambedu CMBT Parking', distance: '0.2 km', available: 42, total: 100, price: '₹20/hr' },
                { name: 'Phoenix Market City Lot B', distance: '1.5 km', available: 5, total: 500, price: '₹50/hr' },
                { name: 'Marina Beach South Lot', distance: '3.1 km', available: 12, total: 200, price: '₹10/hr' },
                { name: 'T-Nagar Smart Parking', distance: '0.8 km', available: 1, total: 20, price: '₹30/hr' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <ServicePageLayout title="Parking Finder" subtitle="Live Availability • TN Smart City" onBack={onBack}>
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-semibold">Searching for vacant spots...</p>
                    </div>
                ) : (
                    spots.map((spot, i) => (
                        <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-lg flex items-center justify-between animate-fadeInUp" style={{animationDelay: `${i*100}ms`}}>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{spot.name}</h3>
                                <div className="flex items-center text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                                    <LocationMarkerIcon className="w-3 h-3 mr-1" />
                                    <span>{spot.distance} • {spot.price}</span>
                                </div>
                                <div className="mt-4 flex gap-1">
                                    {Array.from({length: 10}).map((_, j) => (
                                        <div key={j} className={`h-1 flex-1 rounded-full ${j < (spot.available/spot.total)*10 ? 'bg-blue-500' : 'bg-gray-100'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="ml-6 text-center">
                                <p className={`text-3xl font-black ${spot.available < 10 ? 'text-red-500' : 'text-blue-600'}`}>{spot.available}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Available</p>
                                <button className="mt-2 px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">BOOK</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ServicePageLayout>
    );
};

export default ParkingFinderPage;
