import React, { useState, useRef } from 'react';
import ServicePageLayout from '../services/ServicePageLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { CameraIcon, CheckCircleIcon, DocumentTextIcon, HeartIcon } from '../../components/icons/NavIcons';
import type { DonationRequest } from '../../types';

interface RequestMedicalHelpPageProps {
  onBack: () => void;
  onSubmit: (requestData: Omit<DonationRequest, 'id' | 'raised'>) => void;
}

const RequestMedicalHelpPage: React.FC<RequestMedicalHelpPageProps> = ({ onBack, onSubmit }) => {
    const { t } = useTranslation();
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [hospital, setHospital] = useState('');
    const [goal, setGoal] = useState('');
    const [story, setStory] = useState('');
    const [upi, setUpi] = useState('');
    const [contact, setContact] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [submitted, setSubmitted] = useState(false);
    
    const imageInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleDocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setDocuments(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullStory = `${story}\n\nFor Donations: UPI ID - ${upi}\nFor Verification: Contact - ${contact}`;
        onSubmit({
            title: `Medical aid for ${patientName}`,
            patientName,
            hospital,
            goal: parseInt(goal, 10),
            story: fullStory,
            image,
        });
        setSubmitted(true);
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";

    if (submitted) {
        return (
            <ServicePageLayout title="Request Submitted" subtitle="" onBack={onBack}>
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4 inline-block">
                        <CheckCircleIcon />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Your Request is Under Review</h2>
                    <p className="text-gray-600 mt-2 max-w-md">Your request for medical assistance has been submitted. It will be reviewed by our team and will be made public upon successful verification. You will be notified of the status.</p>
                    <button onClick={onBack} className="mt-6 w-full max-w-xs py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transition-transform shadow-lg">
                        Back to Profile
                    </button>
                </div>
            </ServicePageLayout>
        );
    }

    return (
        <ServicePageLayout
            title="Request Medical Aid"
            subtitle="Create a request for financial assistance with dignity"
            onBack={onBack}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-gray-700 block mb-2">Patient's Full Name</label><input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} required className={inputClasses} /></div>
                    <div><label className="text-sm font-medium text-gray-700 block mb-2">Patient's Age</label><input type="number" value={age} onChange={e => setAge(e.target.value)} required className={inputClasses} /></div>
                </div>
                <div><label className="text-sm font-medium text-gray-700 block mb-2">Hospital Name</label><input type="text" value={hospital} onChange={e => setHospital(e.target.value)} required className={inputClasses} /></div>
                <div><label className="text-sm font-medium text-gray-700 block mb-2">Tell your story</label><textarea rows={5} value={story} onChange={e => setStory(e.target.value)} placeholder="Explain the medical situation and why you need help..." required className={inputClasses} /></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-gray-700 block mb-2">Financial Goal (in INR)</label><input type="number" value={goal} onChange={e => setGoal(e.target.value)} required className={inputClasses} /></div>
                    <div><label className="text-sm font-medium text-gray-700 block mb-2">GPay / UPI ID for Donations</label><input type="text" value={upi} onChange={e => setUpi(e.target.value)} required className={inputClasses} /></div>
                </div>

                <div><label className="text-sm font-medium text-gray-700 block mb-2">Contact for Verification</label><input type="tel" value={contact} onChange={e => setContact(e.target.value)} required className={inputClasses} /></div>

                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Patient's Photo (Optional)</label>
                    <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} className="hidden" />
                    {image ? (
                        <div className="relative group animate-scaleIn"><img src={image} alt="Patient preview" className="w-full h-48 object-cover rounded-xl" /><button type="button" onClick={() => imageInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">Change Photo</button></div>
                    ) : (
                        <button type="button" onClick={() => imageInputRef.current?.click()} className="w-full h-32 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-600 hover:bg-green-50 hover:text-green-600 border-2 border-transparent hover:border-green-200 transition-all"><CameraIcon /><span className="mt-2 text-sm font-semibold">Upload Photo</span></button>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Verification Documents</label>
                    <input type="file" multiple ref={docInputRef} onChange={handleDocChange} className="hidden" />
                    <button type="button" onClick={() => docInputRef.current?.click()} className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-green-500 transition-colors"><DocumentTextIcon /><span className="mt-1 text-sm font-semibold">Upload Medical Reports, Bills, etc.</span></button>
                    {documents.length > 0 && <div className="mt-2 text-sm text-gray-600">{documents.length} file(s) selected.</div>}
                </div>
                
                 <button type="submit" className="w-full py-3 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-transform shadow-lg flex items-center justify-center space-x-2"><HeartIcon className="w-5 h-5" /><span>Submit Request</span></button>
            </form>
        </ServicePageLayout>
    );
};

export default RequestMedicalHelpPage;