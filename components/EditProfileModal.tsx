

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import * as mockApi from '../api/mockApi';
import { INDIAN_STATES } from '../constants';
import { User, LocationData } from '../types';

interface EditProfileModalProps {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user?.name || '');
    const [state, setState] = useState(user?.location.state || '');
    const [district, setDistrict] = useState(user?.location.district || '');
    const [districts, setDistricts] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (state) {
            setDistricts(INDIAN_STATES[state] || []);
        } else {
            setDistricts([]);
        }
        if (user?.location.state !== state) {
            setDistrict('');
        }
    }, [state, user?.location.state]);

    const handleSave = async () => {
        if (!user || !name || !state || !district) return;
        setIsSaving(true);
        const updatedLocation: LocationData = { ...user.location, state, district };
        const updatedUser: User = { ...user, name, location: updatedLocation };
        
        onSave(updatedUser);
        // setIsSaving is handled by the parent component now, but we can set it to false after a delay
        // to show feedback, or the parent can close the modal which unmounts it.
    };

    const selectClasses = "w-full px-4 py-3 bg-gray-100 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800";


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className={selectClasses} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">State</label>
                        <select value={state} onChange={(e) => setState(e.target.value)} className={selectClasses}>
                            <option value="">Select State</option>
                            {Object.keys(INDIAN_STATES).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">District / City</label>
                        <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectClasses} disabled={!state}>
                            <option value="">Select District</option>
                            {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-3">
                     <button onClick={onClose} className="w-full py-2.5 px-4 text-gray-700 font-semibold rounded-xl bg-gray-200 hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="w-full py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;