import React from 'react';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { UserCircleIcon, PhoneIcon, LocationMarkerIcon } from '../../components/icons/NavIcons';

interface HelpAndSupportPageProps {
  onBack: () => void;
}

const ContactCard: React.FC<{ name: string; role: string; phone: string }> = ({ name, role, phone }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <UserCircleIcon className="w-8 h-8" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-800">{name}</h3>
                <p className="text-sm font-semibold text-teal-600">{role}</p>
                <a href={`tel:${phone}`} className="mt-2 inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{phone}</span>
                </a>
            </div>
        </div>
    </div>
);

const HelpAndSupportPage: React.FC<HelpAndSupportPageProps> = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <ServicePageLayout
            title="Help & Support"
            subtitle="Contact our team for assistance"
            onBack={onBack}
        >
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Our Team</h2>
                    <div className="space-y-4">
                        <ContactCard 
                            name="Mohamed Mubasshir M"
                            role="Ideator and Developer"
                            phone="9361855808"
                        />
                        <ContactCard 
                            name="Mohamed Hisham M"
                            role="Managing People Voice"
                            phone="8637644352"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Reach Us</h2>
                     <div className="bg-white p-5 rounded-2xl border border-gray-200">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                <LocationMarkerIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">UNIFIED'S HOUSE</h3>
                                <p className="text-sm text-gray-600">
                                    Near Masjid E Muhammad,<br />
                                    Backside CM Office, Koyambedu,<br />
                                    Chennai
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ServicePageLayout>
    );
};

export default HelpAndSupportPage;
