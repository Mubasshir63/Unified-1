
import React, { useState, useMemo } from 'react';
import { DetailedReport, ReportStatus, TeamMember } from '../../../types';
import { UserCircleIcon, CheckCircleIcon, ChartBarIcon, ShieldIcon, PlusCircleIcon } from '../../../components/icons/NavIcons';
import TeamMemberModal from '../components/TeamMemberModal';

interface TeamMemberCardProps {
    member: TeamMember;
    // FIX: Pass stats as a separate prop because TeamMember interface does not include them.
    stats: {
        assigned: number;
        resolved: number;
        avgTime: string;
        sla: number;
    };
    onEdit: (member: TeamMember) => void;
    onDelete: (memberId: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, stats, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col text-center items-center tilt-card">
        <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mb-3 border-4 border-gray-100" />
        <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
        <p className="text-sm font-semibold text-teal-600 mb-4">{member.role}</p>
        
        <div className="w-full grid grid-cols-2 gap-2 text-xs my-auto">
            {/* FIX: Use the stats prop passed from the parent. */}
            <div className="bg-blue-50 p-2 rounded-lg"><p className="font-bold text-blue-700 text-lg">{stats.assigned}</p><p className="text-blue-600 font-medium">Assigned</p></div>
            <div className="bg-green-50 p-2 rounded-lg"><p className="font-bold text-green-700 text-lg">{stats.resolved}</p><p className="text-green-600 font-medium">Resolved</p></div>
            <div className="bg-yellow-50 p-2 rounded-lg"><p className="font-bold text-yellow-700 text-lg">{stats.avgTime}</p><p className="text-yellow-600 font-medium">Avg Time</p></div>
            <div className="bg-indigo-50 p-2 rounded-lg"><p className="font-bold text-indigo-700 text-lg">{stats.sla}%</p><p className="text-indigo-600 font-medium">SLA</p></div>
        </div>

        <div className="w-full flex items-center space-x-2 mt-4 pt-4 border-t">
            <button onClick={() => onEdit(member)} className="flex-1 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Edit</button>
            <button onClick={() => onDelete(member.id)} className="flex-1 py-2 text-sm font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Delete</button>
        </div>
    </div>
);


const TeamMemberCardSkeleton: React.FC = () => (
     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col text-center items-center animate-shimmer">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-3"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
        <div className="w-full grid grid-cols-2 gap-2 my-auto">
            <div className="bg-gray-200 h-14 rounded-lg"></div>
            <div className="bg-gray-200 h-14 rounded-lg"></div>
            <div className="bg-gray-200 h-14 rounded-lg"></div>
            <div className="bg-gray-200 h-14 rounded-lg"></div>
        </div>
         <div className="w-full flex items-center space-x-2 mt-4 pt-4 border-t">
            <div className="h-9 flex-1 bg-gray-200 rounded-lg"></div>
            <div className="h-9 flex-1 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
)


interface TeamManagementViewProps {
    team: TeamMember[];
    isLoading: boolean;
    onAddMember: (memberData: Pick<TeamMember, 'name' | 'role'>) => void;
    onUpdateMember: (member: TeamMember) => void;
    onDeleteMember: (memberId: string) => void;
}

const TeamManagementView: React.FC<TeamManagementViewProps> = ({ team, isLoading, onAddMember, onUpdateMember, onDeleteMember }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    // FIX: Generate mock stats for team members locally since they are missing from the data model.
    const memberStats = useMemo(() => {
        return team.reduce((acc, member) => {
            acc[member.id] = {
                assigned: Math.floor(Math.random() * 10),
                resolved: Math.floor(Math.random() * 20),
                avgTime: `${(Math.random() * 5 + 1).toFixed(1)}h`,
                sla: 85 + Math.floor(Math.random() * 15)
            };
            return acc;
        }, {} as Record<string, { assigned: number; resolved: number; avgTime: string; sla: number; }>);
    }, [team]);

    const handleOpenAddModal = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (member: TeamMember) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleSaveMember = (memberData: TeamMember | Pick<TeamMember, 'name' | 'role'>) => {
        if ('id' in memberData) {
            onUpdateMember(memberData);
        } else {
            onAddMember(memberData);
        }
        handleCloseModal();
    };
    
    const handleDeleteMember = (memberId: string) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            onDeleteMember(memberId);
        }
    };
    
    return (
        <div className="p-4 md:p-6 animate-fadeInUp">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Team Management</h1>
                <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add New Member</span>
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <TeamMemberCardSkeleton key={i} />)
                ) : (
                    team.map(member => (
                        <TeamMemberCard 
                            key={member.id} 
                            member={member}
                            // FIX: Pass generated stats.
                            stats={memberStats[member.id] || { assigned: 0, resolved: 0, avgTime: '0h', sla: 0 }}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteMember}
                        />
                    ))
                )}
            </div>
            
            {isModalOpen && (
                <TeamMemberModal 
                    member={editingMember}
                    onSave={handleSaveMember}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default TeamManagementView;
