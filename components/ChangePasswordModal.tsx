
import React, { useState } from 'react';
import { User } from '../types';
import * as mockApi from '../api/mockApi';
import { useNotifications } from '../contexts/NotificationsContext';

interface ChangePasswordModalProps {
    user: User;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ user, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useNotifications();

    const handleSave = async () => {
        setError('');
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }
        setIsSaving(true);
        const success = await mockApi.changePassword(user.email, currentPassword, newPassword);
        setIsSaving(false);
        if (success) {
            showToast("Password updated successfully!");
            onClose();
        } else {
            setError("The current password you entered is incorrect.");
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-100 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-800";

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                </div>
                <div className="p-6 space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClasses} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClasses} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClasses} />
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-3">
                     <button onClick={onClose} className="w-full py-2.5 px-4 text-gray-700 font-semibold rounded-xl bg-gray-200 hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="w-full py-2.5 px-4 text-white font-semibold rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;