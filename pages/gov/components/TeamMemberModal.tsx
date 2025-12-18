import React, { useState, useEffect } from 'react';
import { TeamMember } from '../../../types';

interface TeamMemberModalProps {
    member: TeamMember | null;
    onSave: (memberData: TeamMember | Pick<TeamMember, 'name' | 'role'>) => void;
    onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<'Officer' | 'Department Head'>('Officer');

    useEffect(() => {
        if (member) {
            setName(member.name);
            setRole(member.role);
        } else {
            setName('');
            setRole('Officer');
        }
    }, [member]);

    const handleSave = () => {
        if (name.trim() === '') return;

        if (member) {
            onSave({ ...member, name, role });
        } else {
            onSave({ name, role });
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-100 border-2 border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-800";

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
                    <h2 className="text-xl font-bold text-gray-800">{member ? 'Edit Team Member' : 'Add New Team Member'}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="memberName" className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
                        <input id="memberName" type="text" value={name} onChange={e => setName(e.target.value)} className={inputClasses} />
                    </div>
                     <div>
                        <label htmlFor="memberRole" className="text-sm font-medium text-gray-700 block mb-2">Role</label>
                        <select id="memberRole" value={role} onChange={(e) => setRole(e.target.value as 'Officer' | 'Department Head')} className={inputClasses}>
                            <option value="Officer">Field Officer</option>
                            <option value="Department Head">Department Head</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-2xl grid grid-cols-2 gap-3">
                     <button onClick={onClose} className="w-full py-2.5 px-4 text-gray-700 font-semibold rounded-xl bg-gray-200 hover:bg-gray-300">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={!name.trim()} className="w-full py-2.5 px-4 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50">
                        {member ? 'Save Changes' : 'Add Member'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamMemberModal;
