

import React from 'react';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { 
    NewReportIcon, 
    ServicesIcon, 
    SOSIcon, 
    UsersIcon, 
    MapIcon 
} from '../../components/icons/NavIcons';

interface AboutUsPageProps {
  onBack: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

const AboutUsPage: React.FC<AboutUsPageProps> = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <ServicePageLayout
            title="About UNIFIED"
            subtitle="Smart City in a Smart Phone"
            onBack={onBack}
        >
            <div className="space-y-6">
                <div className="text-center">
                    <svg height="45" viewBox="0 0 200 40" className="w-48 mx-auto">
                         <defs>
                            <linearGradient id="tricolorGradientAbout" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF9933" /><stop offset="33%" stopColor="#FF9933" /><stop offset="33.01%" stopColor="#FFFFFF" /><stop offset="48%" stopColor="#FFFFFF" /><stop offset="48.01%" stopColor="#000080" /><stop offset="51.99%" stopColor="#000080" /><stop offset="52%" stopColor="#FFFFFF" /><stop offset="66.99%" stopColor="#FFFFFF" /><stop offset="67%" stopColor="#138808" /><stop offset="100%" stopColor="#138808" /></linearGradient>
                        </defs>
                        <text x="50%" y="50%" dy=".35em" textAnchor="middle" fontSize="30" fontFamily="Inter, sans-serif" fontWeight="800" fill="url(#tricolorGradientAbout)" stroke="#475569" strokeWidth="0.3">UNIFIED</text>
                    </svg>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        UNIFIED is a revolutionary smart city and citizen-connect platform designed for India. Our mission is to bridge the gap between citizens and governance, creating a more responsive, efficient, and engaged community.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 text-center">Our Core Features</h2>
                    <FeatureCard
                        icon={<NewReportIcon />}
                        title="Seamless Issue Reporting"
                        description="Instantly report civic issues like potholes, garbage dumps, or broken streetlights with photos and geotags. Track the status of your reports from submission to resolution."
                    />
                    <FeatureCard
                        icon={<ServicesIcon isActive />}
                        title="Centralized City Services"
                        description="Access a wide array of government services, pay utility bills, apply for certificates, and find information on official schemes, all from a single, easy-to-use interface."
                    />
                    <FeatureCard
                        icon={<SOSIcon className="text-red-500" />}
                        title="Advanced SOS & Safety"
                        description="Your safety is our priority. Activate SOS alerts by holding a button or simply shaking your phone. Your location and a live video are shared with emergency services and trusted contacts."
                    />
                    <FeatureCard
                        icon={<MapIcon className="w-8 h-8"/>}
                        title="Interactive City Map"
                        description="Visualize your city like never before. See a live map of reported issues, find nearby public facilities, check 'Digital Twin' heatmaps for issue hotspots, and navigate with ease."
                    />
                     <FeatureCard
                        icon={<UsersIcon />}
                        title="Community Engagement"
                        description="Participate in local events, volunteer for community drives, and support urgent medical needs through our donation platform. Together, we can build a better city."
                    />
                </div>
            </div>
        </ServicePageLayout>
    );
};

export default AboutUsPage;
