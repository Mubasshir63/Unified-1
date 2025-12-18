
import React, { useState, useEffect } from 'react';
import ServicePageLayout from '../services/ServicePageLayout';
import { EmergencyContact } from '../../types';
import * as mockApi from '../../api/mockApi';
import { useNotifications } from '../../contexts/NotificationsContext';
import { UserCircleIcon, PhoneIcon, TrashIcon, PlusCircleIcon } from '../../components/icons/NavIcons';

interface EmergencyContactsPageProps {
    onBack: () => void;
}

const EmergencyContactsPage: React.FC<EmergencyContactsPageProps> = ({ onBack }) => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const { showToast } = useNotifications();

    useEffect(() => {
        mockApi.getEmergencyContacts().then(setContacts);
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newName && newPhone) {
            const newContact = await mockApi.addEmergencyContact(newName, newPhone);
            setContacts(prev => [...prev, newContact]);
            setNewName('');
            setNewPhone('');
            setIsAdding(false);
            showToast('Emergency contact added.');
        }
    };

    const handleDelete = async (id: number) => {
        await mockApi.deleteEmergencyContact(id);
        setContacts(prev => prev.filter(c => c.id !== id));
        showToast('Contact removed.');
    };

    return (
        <ServicePageLayout title="Emergency Contacts" subtitle="Manage trusted contacts for SOS alerts" onBack={onBack}>
            <div className="space-y-4">
                {contacts.map(contact => (
                    <div key={contact.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm animate-fadeInUp">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                <UserCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{contact.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center"><PhoneIcon className="w-3 h-3 mr-1"/> {contact.phone}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(contact.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {isAdding ? (
                    <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl border border-teal-200 shadow-md space-y-3 animate-scaleIn">
                        <h3 className="font-bold text-gray-800">New Contact</h3>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={newName} 
                            onChange={e => setNewName(e.target.value)} 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            required
                        />
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={newPhone} 
                            onChange={e => setNewPhone(e.target.value)} 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            required
                        />
                        <div className="flex space-x-2">
                            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">Save</button>
                        </div>
                    </form>
                ) : (
                    <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all animate-fadeInUp">
                        <PlusCircleIcon className="w-5 h-5 mr-2" /> Add New Contact
                    </button>
                )}
                
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4 animate-fadeInUp">
                    <p className="text-xs text-blue-700 text-center">
                        These contacts will receive an SMS with your live location and a video link immediately when you activate SOS.
                    </p>
                </div>
            </div>
        </ServicePageLayout>
    );
};

export default EmergencyContactsPage;
