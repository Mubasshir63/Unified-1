

import { MapPoint, ReportStatus } from '../types';

export const MAP_POINTS: MapPoint[] = [
    // --- FACILITIES ---
    {
        id: 'facility-1',
        type: 'facility',
        coords: { lat: 13.085, lng: 80.26 },
        details: {
            id: 201,
            title: 'General Hospital Chennai',
            status: ReportStatus.Resolved, // Interpreted as 'Open'
            date: '',
            category: 'Hospital',
            description: 'A multi-specialty government hospital providing 24/7 emergency services, outpatient, and inpatient care.',
            location: '123 Health St, Medical Complex, Chennai',
            coords: { lat: 13.085, lng: 80.26 },
            updates: []
        }
    },
    {
        id: 'facility-2',
        type: 'facility',
        coords: { lat: 13.06, lng: 80.25 },
        details: {
            id: 202,
            title: 'Central Bus Station',
            status: ReportStatus.Resolved, // Interpreted as 'Operational'
            date: '',
            category: 'Transport Hub',
            description: 'Main bus terminal for inter-city and local transport. Features include a waiting area, ticket counters, and food stalls.',
            location: 'Transportation Square, Chennai',
            coords: { lat: 13.06, lng: 80.25 },
            updates: []
        }
    },
    // New Delhi
    {
        id: 'facility-3',
        type: 'facility',
        coords: { lat: 28.6315, lng: 77.2167 },
        details: { id: 203, title: 'Connaught Place Police Station', status: ReportStatus.Resolved, date: '', category: 'Police Station', description: 'Serving the Connaught Place area. Emergency dial 100.', location: 'Connaught Place, New Delhi', coords: { lat: 28.6315, lng: 77.2167 }, updates: [] }
    },
    {
        id: 'facility-4',
        type: 'facility',
        coords: { lat: 28.6228, lng: 77.2397 },
        details: { id: 204, title: 'Supreme Court of India', status: ReportStatus.Resolved, date: '', category: 'Court', description: 'The highest judicial court in India.', location: 'Tilak Marg, New Delhi', coords: { lat: 28.6228, lng: 77.2397 }, updates: [] }
    },
    {
        id: 'facility-5',
        type: 'facility',
        coords: { lat: 28.5668, lng: 77.2081 },
        details: { id: 205, title: 'AIIMS Pharmacy', status: ReportStatus.Resolved, date: '', category: 'Pharmacy', description: '24/7 Pharmacy at the All India Institute Of Medical Sciences.', location: 'AIIMS, Ansari Nagar East, New Delhi', coords: { lat: 28.5668, lng: 77.2081 }, updates: [] }
    },
    // Mumbai
    {
        id: 'facility-6',
        type: 'facility',
        coords: { lat: 19.0441, lng: 72.8631 },
        details: { id: 206, title: 'Dharavi Police Station', status: ReportStatus.Resolved, date: '', category: 'Police Station', description: 'Local police station for the Dharavi area.', location: 'Dharavi, Mumbai', coords: { lat: 19.0441, lng: 72.8631 }, updates: [] }
    },
    {
        id: 'facility-7',
        type: 'facility',
        coords: { lat: 18.9398, lng: 72.8329 },
        details: { id: 207, title: 'Bombay High Court', status: ReportStatus.Resolved, date: '', category: 'Court', description: 'One of the oldest High Courts in India.', location: 'Fort, Mumbai', coords: { lat: 18.9398, lng: 72.8329 }, updates: [] }
    },
    {
        id: 'facility-8',
        type: 'facility',
        coords: { lat: 19.0785, lng: 72.8839 },
        details: { id: 208, title: 'Public Toilet with Sanitary Pad Vending Machine', status: ReportStatus.Resolved, date: '', category: 'Sanitary Pad Dispenser', description: 'Maintained by the municipal corporation, equipped with a sanitary pad vending machine.', location: 'Kurla West, Mumbai', coords: { lat: 19.0785, lng: 72.8839 }, updates: [] }
    },
    // Bengaluru
    {
        id: 'facility-9',
        type: 'facility',
        coords: { lat: 12.9642, lng: 77.5753 },
        details: { id: 209, title: 'Victoria Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'Major government hospital with extensive facilities.', location: 'Fort, Bengaluru', coords: { lat: 12.9642, lng: 77.5753 }, updates: [] }
    },
    {
        id: 'facility-10',
        type: 'facility',
        coords: { lat: 12.9719, lng: 77.5937 },
        details: { id: 210, title: 'Cubbon Park Police Station', status: ReportStatus.Resolved, date: '', category: 'Police Station', description: 'Ensuring safety in and around the Cubbon Park area.', location: 'Cubbon Park, Bengaluru', coords: { lat: 12.9719, lng: 77.5937 }, updates: [] }
    },
     {
        id: 'facility-11',
        type: 'facility',
        coords: { lat: 12.9784, lng: 77.5919 },
        details: { id: 211, title: 'High Court of Karnataka', status: ReportStatus.Resolved, date: '', category: 'Court', description: 'The highest judicial authority in the state of Karnataka.', location: 'Ambedkar Veedhi, Bengaluru', coords: { lat: 12.9784, lng: 77.5919 }, updates: [] }
    },
    // Kolkata
    {
        id: 'facility-12',
        type: 'facility',
        coords: { lat: 22.5746, lng: 88.3626 },
        details: { id: 212, title: 'Calcutta Medical College and Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'A leading medical institution in Kolkata.', location: 'College Street, Kolkata', coords: { lat: 22.5746, lng: 88.3626 }, updates: [] }
    },
    {
        id: 'facility-13',
        type: 'facility',
        coords: { lat: 22.5697, lng: 88.3697 },
        details: { id: 213, title: 'Lalbazar Police Headquarters', status: ReportStatus.Resolved, date: '', category: 'Police Station', description: 'Headquarters of the Kolkata Police force.', location: 'Lalbazar, Kolkata', coords: { lat: 22.5697, lng: 88.3697 }, updates: [] }
    },
    // Hyderabad
    {
        id: 'facility-14',
        type: 'facility',
        coords: { lat: 17.3616, lng: 78.4747 },
        details: { id: 214, title: 'Charminar Unani Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'Historic government hospital specializing in Unani medicine.', location: 'Charminar, Hyderabad', coords: { lat: 17.3616, lng: 78.4747 }, updates: [] }
    },
    {
        id: 'facility-15',
        type: 'facility',
        coords: { lat: 17.3871, lng: 78.4820 },
        details: { id: 215, title: 'Sultan Bazar Police Station', status: ReportStatus.Resolved, date: '', category: 'Police Station', description: 'Police station covering the busy Sultan Bazar market area.', location: 'Sultan Bazar, Hyderabad', coords: { lat: 17.3871, lng: 78.4820 }, updates: [] }
    },
    // Ahmedabad
    {
        id: 'facility-16',
        type: 'facility',
        coords: { lat: 23.0539, lng: 72.6022 },
        details: { id: 216, title: 'Ahmedabad Civil Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'One of the largest hospitals in Asia, located in Asarwa area.', location: 'Asarwa, Ahmedabad', coords: { lat: 23.0539, lng: 72.6022 }, updates: [] }
    },
    // Pune
    {
        id: 'facility-17',
        type: 'facility',
        coords: { lat: 18.5308, lng: 73.8475 },
        details: { id: 217, title: 'District and Sessions Court', status: ReportStatus.Resolved, date: '', category: 'Court', description: 'Primary civil and criminal court for Pune district.', location: 'Shivajinagar, Pune', coords: { lat: 18.5308, lng: 73.8475 }, updates: [] }
    },
    // Jaipur
    {
        id: 'facility-18',
        type: 'facility',
        coords: { lat: 26.9153, lng: 75.8091 },
        details: { id: 218, title: 'Apollo Pharmacy', status: ReportStatus.Resolved, date: '', category: 'Pharmacy', description: '24-hour pharmacy located in the heart of the city.', location: 'MI Road, Jaipur', coords: { lat: 26.9153, lng: 75.8091 }, updates: [] }
    },
    // NEW NEARBY FACILITIES
    {
        id: 'facility-301', type: 'facility', coords: { lat: 13.08, lng: 80.28 },
        details: { id: 301, title: 'Indian Oil Petrol Bunk', status: ReportStatus.Resolved, date: '', category: 'Petrol Bunk', description: '24/7 Petrol & Diesel station with air and water facilities.', location: 'Kamarajar Salai, Chennai', coords: { lat: 13.08, lng: 80.28 }, updates: [] }
    },
    {
        id: 'facility-302', type: 'facility', coords: { lat: 13.07, lng: 80.26 },
        details: { id: 302, title: 'Shiva Auto Works', status: ReportStatus.Resolved, date: '', category: 'Mechanic', description: 'Two-wheeler and four-wheeler repair and service.', location: 'Pudupet, Chennai', coords: { lat: 13.07, lng: 80.26 }, updates: [] }
    },
    {
        id: 'facility-303', type: 'facility', coords: { lat: 13.09, lng: 80.25 },
        details: { id: 303, title: 'Public Distribution Ration Shop', status: ReportStatus.Resolved, date: '', category: 'Ration Shop', description: 'Government authorized ration shop for subsidized grains.', location: 'Perambur, Chennai', coords: { lat: 13.09, lng: 80.25 }, updates: [] }
    },
    {
        id: 'facility-304', type: 'facility', coords: { lat: 13.084, lng: 80.278 },
        details: { id: 304, title: 'Ripon Building (Corporation)', status: ReportStatus.Resolved, date: '', category: 'Govt Office', description: 'Headquarters of the Greater Chennai Corporation.', location: 'Poonamallee High Road, Chennai', coords: { lat: 13.084, lng: 80.278 }, updates: [] }
    },
    {
        id: 'facility-305', type: 'facility', coords: { lat: 28.61, lng: 77.21 },
        details: { id: 305, title: 'Hindustan Petroleum', status: ReportStatus.Resolved, date: '', category: 'Petrol Bunk', description: 'Petrol, Diesel, and CNG available.', location: 'Janpath, New Delhi', coords: { lat: 28.61, lng: 77.21 }, updates: [] }
    },

    // --- NEWLY ADDED FACILITIES ---

    // Coimbatore
    {
        id: 'facility-401',
        type: 'facility',
        coords: { lat: 11.0086, lng: 76.9716 },
        details: { id: 401, title: 'KG Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'Kovai Medical Center and Hospital, a leading multi-specialty hospital.', location: 'Arts College Rd, Gopalapuram, Coimbatore', coords: { lat: 11.0086, lng: 76.9716 }, updates: [] }
    },
    {
        id: 'facility-402',
        type: 'facility',
        coords: { lat: 11.0210, lng: 76.9416 },
        details: { id: 402, title: 'GKNM Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'G. Kuppuswamy Naidu Memorial Hospital, renowned for its quality healthcare.', location: 'Pappanaickenpalayam, Coimbatore', coords: { lat: 11.0210, lng: 76.9416 }, updates: [] }
    },
    {
        id: 'facility-403',
        type: 'facility',
        coords: { lat: 11.0183, lng: 76.9698 },
        details: { id: 403, title: 'Gandhipuram Central Bus Terminus', status: ReportStatus.Resolved, date: '', category: 'Transport Hub', description: 'Major bus terminal connecting various parts of the city and state.', location: 'Gandhipuram, Coimbatore', coords: { lat: 11.0183, lng: 76.9698 }, updates: [] }
    },
    {
        id: 'facility-404',
        type: 'facility',
        coords: { lat: 10.9997, lng: 76.9710 },
        details: { id: 404, title: 'Race Course Police Station', status: ReportStatus.Resolved, date: '', category: 'Police Station', description: 'Serving the Race Course area and surroundings.', location: 'Race Course, Coimbatore', coords: { lat: 10.9997, lng: 76.9710 }, updates: [] }
    },
    {
        id: 'facility-405',
        type: 'facility',
        coords: { lat: 11.0215, lng: 76.9912 },
        details: { id: 405, title: 'Indian Oil Petrol Bunk', status: ReportStatus.Resolved, date: '', category: 'Petrol Bunk', description: '24/7 petrol and diesel station on Avinashi Road.', location: 'Avinashi Road, Peelamedu, Coimbatore', coords: { lat: 11.0215, lng: 76.9912 }, updates: [] }
    },
    {
        id: 'facility-406',
        type: 'facility',
        coords: { lat: 11.0050, lng: 76.9550 },
        details: { id: 406, title: 'Maruthi Auto Garage', status: ReportStatus.Resolved, date: '', category: 'Mechanic', description: 'Multi-brand car service and repair center.', location: 'R.S. Puram, Coimbatore', coords: { lat: 11.0050, lng: 76.9550 }, updates: [] }
    },
    {
        id: 'facility-407',
        type: 'facility',
        coords: { lat: 11.0004, lng: 76.9680 },
        details: { id: 407, title: 'Coimbatore Collector Office', status: ReportStatus.Resolved, date: '', category: 'Govt Office', description: 'The District Collectorate for Coimbatore.', location: 'State Bank Road, Coimbatore', coords: { lat: 11.0004, lng: 76.9680 }, updates: [] }
    },
    {
        id: 'facility-408',
        type: 'facility',
        coords: { lat: 11.0068, lng: 76.9472 },
        details: { id: 408, title: 'Apollo Pharmacy', status: ReportStatus.Resolved, date: '', category: 'Pharmacy', description: '24/7 Pharmacy in R.S. Puram.', location: 'R.S. Puram, Coimbatore', coords: { lat: 11.0068, lng: 76.9472 }, updates: [] }
    },

    // Mumbai
    {
        id: 'facility-409',
        type: 'facility',
        coords: { lat: 19.0560, lng: 72.8285 },
        details: { id: 409, title: 'Lilavati Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'A premier multi-specialty tertiary care hospital of India.', location: 'Bandra West, Mumbai', coords: { lat: 19.0560, lng: 72.8285 }, updates: [] }
    },
    {
        id: 'facility-410',
        type: 'facility',
        coords: { lat: 18.9401, lng: 72.8355 },
        details: { id: 410, title: 'Chhatrapati Shivaji Maharaj Terminus', status: ReportStatus.Resolved, date: '', category: 'Transport Hub', description: 'Historic railway station and a UNESCO World Heritage Site.', location: 'Fort, Mumbai', coords: { lat: 18.9401, lng: 72.8355 }, updates: [] }
    },
    {
        id: 'facility-411',
        type: 'facility',
        coords: { lat: 19.0522, lng: 72.8400 },
        details: { id: 411, title: 'HP Petrol Pump - Bandra', status: ReportStatus.Resolved, date: '', category: 'Petrol Bunk', description: 'Petrol and diesel services in Bandra.', location: 'Bandra West, Mumbai', coords: { lat: 19.0522, lng: 72.8400 }, updates: [] }
    },
    {
        id: 'facility-412',
        type: 'facility',
        coords: { lat: 18.9481, lng: 72.8295 },
        details: { id: 412, title: 'Mumbai Police Headquarters', status: ReportStatus.Resolved, date: '', category: 'Police Station', description: 'Headquarters of the Mumbai Police.', location: 'Crawford Market, Mumbai', coords: { lat: 18.9481, lng: 72.8295 }, updates: [] }
    },

    // Delhi
    {
        id: 'facility-413',
        type: 'facility',
        coords: { lat: 28.6253, lng: 77.1950 },
        details: { id: 413, title: 'Sir Ganga Ram Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'A 675-bed multi-speciality private hospital in Rajinder Nagar, Delhi.', location: 'Rajinder Nagar, New Delhi', coords: { lat: 28.6253, lng: 77.1950 }, updates: [] }
    },
    {
        id: 'facility-414',
        type: 'facility',
        coords: { lat: 28.6428, lng: 77.2188 },
        details: { id: 414, title: 'New Delhi Railway Station', status: ReportStatus.Resolved, date: '', category: 'Transport Hub', description: 'The main railway station in Delhi, situated between Ajmeri Gate and Paharganj.', location: 'Paharganj, New Delhi', coords: { lat: 28.6428, lng: 77.2188 }, updates: [] }
    },

    // Bengaluru
    {
        id: 'facility-415',
        type: 'facility',
        coords: { lat: 12.9716, lng: 77.5833 },
        details: { id: 415, title: 'Mallya Hospital', status: ReportStatus.Resolved, date: '', category: 'Hospital', description: 'A multi-speciality hospital in the heart of Bengaluru.', location: 'Vittal Mallya Road, Bengaluru', coords: { lat: 12.9716, lng: 77.5833 }, updates: [] }
    },
    {
        id: 'facility-416',
        type: 'facility',
        coords: { lat: 12.9797, lng: 77.5721 },
        details: { id: 416, title: 'Majestic Bus Station (Kempegowda)', status: ReportStatus.Resolved, date: '', category: 'Transport Hub', description: 'One of the main bus terminals in Bengaluru.', location: 'Majestic, Bengaluru', coords: { lat: 12.9797, lng: 77.5721 }, updates: [] }
    },
    
    // Kolkata
    {
        id: 'facility-417',
        type: 'facility',
        coords: { lat: 22.5830, lng: 88.3440 },
        details: { id: 417, title: 'Howrah Junction Railway Station', status: ReportStatus.Resolved, date: '', category: 'Transport Hub', description: 'The oldest and largest railway complex in India.', location: 'Howrah, West Bengal', coords: { lat: 22.5830, lng: 88.3440 }, updates: [] }
    }
];
