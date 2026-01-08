
import React, { useState, useContext, useEffect } from 'react';
import GovtHeader from './components/GovtHeader';
import GovtBottomNav from './components/GovtBottomNav';
import GovtSidebar from './components/GovtSidebar';
import ControlRoomView from './views/ControlRoomView';
import SOSView from './views/SOSView';
import IssuesView from './views/IssuesView';
import MapView from './views/MapView';
import ProfileView from './views/ProfileView';
import AnalyticsView from './views/AnalyticsView';
import TeamManagementView from './views/TeamManagementView';
import CommunicationsView from './views/CommunicationsView';
import DataflowView from './views/DataflowView';
import CyberCrimeView from './views/CyberCrimeView';
import HealthView from './views/HealthView';
import TransportView from './views/TransportView';
import SanitationView from './views/SanitationView';
import WaterView from './views/WaterView';
import ElectricityView from './views/ElectricityView';
import HousingView from './views/HousingView';
import SafetyView from './views/SafetyView';
import PublicWorksView from './views/PublicWorksView';
import FinanceView from './views/FinanceView';
import EducationView from './views/EducationView';
import CCTVView from './views/CCTVView';

import { DetailedReport, ReportStatus, SOSAlert, GovtView, Announcement, TeamMember } from '../../types';
import IssueDetailDrawer from './components/IssueDetailDrawer';
import { useNotifications } from '../../contexts/NotificationsContext';
import { UserContext } from '../../contexts/UserContext';
import * as mockApi from '../../api/mockApi';


interface GovtDashboardPageProps {
    reports: DetailedReport[];
    onUpdateReportStatus: (reportId: number, newStatus: ReportStatus) => void;
    onAssignReport: (reportId: number, assigneeName: string) => void;
    alerts: SOSAlert[];
    onSOSAction: (alertId: number, action: 'Acknowledge' | 'Resolve') => void;
}


const GovtDashboardPage: React.FC<GovtDashboardPageProps> = ({ reports: initialReports, onUpdateReportStatus, onAssignReport, alerts: initialAlerts, onSOSAction }) => {
    const { user } = useContext(UserContext);
    // FIX: Changed 'dashboard' to 'control-room' to match GovtView type
    const [activeView, setActiveView] = useState<GovtView>('control-room');
    const [selectedIssue, setSelectedIssue] = useState<DetailedReport | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const { showToast } = useNotifications();
    const [isLoading, setIsLoading] = useState(true);

    const [reports, setReports] = useState<DetailedReport[]>(initialReports);
    const [alerts, setAlerts] = useState<SOSAlert[]>(initialAlerts);

    useEffect(() => {
        setReports(initialReports);
    }, [initialReports]);

    useEffect(() => {
        setAlerts(initialAlerts);
    }, [initialAlerts]);

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            const [announcementData, teamData] = await Promise.all([
                mockApi.getAnnouncements(),
                mockApi.getTeam()
            ]);
            setAnnouncements(announcementData);
            setTeam(teamData);
            setIsLoading(false);
        };
        
        const timer = setTimeout(fetchData, 500); // Simulate network delay
        return () => clearTimeout(timer);
        
    }, [activeView]);


    if (!user) { 
        return null;
    }

    const handleAssignIssue = (issueId: number, assigneeName: string) => {
        onAssignReport(issueId, assigneeName);
        setSelectedIssue(prev => prev && prev.id === issueId ? { ...prev, assigned_to: { name: assigneeName, id: assigneeName, role: 'Officer' }, status: ReportStatus.UnderReview } : prev);
        showToast(`Issue #${issueId} assigned to ${assigneeName}`);
    };
    
    const handleStatusChange = (issueId: number, newStatus: ReportStatus) => {
        onUpdateReportStatus(issueId, newStatus);
        setSelectedIssue(prev => prev && prev.id === issueId ? { ...prev, status: newStatus } : null);
        showToast(`Issue #${issueId} status updated to ${newStatus}`);
    };

    const handleCreateAnnouncement = async (newAnnouncementData: Omit<Announcement, 'id' | 'timestamp'>) => {
        const newAnnouncement = await mockApi.createAnnouncement(newAnnouncementData);
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        showToast('Announcement published successfully!');
    };
    
    const handleAddTeamMember = async (memberData: Pick<TeamMember, 'name' | 'role'>) => {
        const newMember = await mockApi.addTeamMember(memberData);
        setTeam(prev => [newMember, ...prev]);
        showToast(`Added ${newMember.name} to the team.`);
    };

    const handleUpdateTeamMember = async (member: TeamMember) => {
        const updatedMember = await mockApi.updateTeamMember(member);
        if (updatedMember) {
            setTeam(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
            showToast(`Updated ${updatedMember.name}'s profile.`);
        }
    };

    const handleDeleteTeamMember = async (memberId: string) => {
        const success = await mockApi.deleteTeamMember(memberId);
        if (success) {
            setTeam(prev => prev.filter(m => m.id !== memberId));
            showToast(`Team member removed.`);
        }
    };


    const renderView = () => {
        switch (activeView) {
            case 'control-room':
                return <ControlRoomView reports={reports} onSelectIssue={setSelectedIssue} isLoading={isLoading} alerts={alerts} />;
            case 'cctv-grid':
                return <CCTVView isLoading={isLoading} />;
            case 'sos':
                return <SOSView alerts={alerts} onAction={onSOSAction} isLoading={isLoading} />;
            case 'issues':
                return <IssuesView issues={reports} onSelectIssue={setSelectedIssue} isLoading={isLoading} />;
            case 'map':
                return <MapView issues={reports} onSelectIssue={setSelectedIssue} userLocation={user.location.coords} isLoading={isLoading} />;
            case 'analytics':
                return <AnalyticsView issues={reports} isLoading={isLoading} />;
            case 'team':
                return <TeamManagementView 
                    team={team}
                    issues={reports}
                    isLoading={isLoading} 
                    onAddMember={handleAddTeamMember}
                    onUpdateMember={handleUpdateTeamMember}
                    onDeleteMember={handleDeleteTeamMember}
                />;
            case 'communications':
                return <CommunicationsView announcements={announcements} onCreate={handleCreateAnnouncement} isLoading={isLoading} />;
            case 'dataflow':
                return <DataflowView isLoading={isLoading} />;
            case 'cyber-crime':
                return <CyberCrimeView isLoading={isLoading} />;
            case 'health':
                return <HealthView isLoading={isLoading} issues={reports} />;
            case 'transport':
                return <TransportView isLoading={isLoading} issues={reports} userLocation={user.location.coords} onSelectIssue={setSelectedIssue} />;
            case 'sanitation':
                return <SanitationView isLoading={isLoading} issues={reports} userLocation={user.location.coords} onSelectIssue={setSelectedIssue} />;
            case 'water':
                return <WaterView isLoading={isLoading} issues={reports} />;
            case 'electricity':
                return <ElectricityView isLoading={isLoading} issues={reports} />;
            case 'housing':
                return <HousingView isLoading={isLoading} issues={reports} />;
            case 'safety':
                return <SafetyView isLoading={isLoading} alerts={alerts} issues={reports} />;
            case 'public-works':
                return <PublicWorksView isLoading={isLoading} issues={reports} />;
            case 'finance':
                return <FinanceView isLoading={isLoading} issues={reports} />;
            case 'education':
                return <EducationView isLoading={isLoading} issues={reports} />;
            case 'profile':
            case 'administration':
                 return <ProfileView isLoading={isLoading} />;
            default:
                // FIX: Changed 'dashboard' fallback to 'control-room'
                return <ControlRoomView reports={reports} onSelectIssue={setSelectedIssue} isLoading={isLoading} alerts={alerts} />;
        }
    };

    return (
        <div className="h-dvh bg-slate-900 font-sans flex">
            <GovtSidebar activeView={activeView} setActiveView={setActiveView} alerts={alerts} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <GovtHeader onProfileClick={() => setActiveView('profile')} />
                <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-slate-800/50">
                    <div key={activeView} className="h-full animate-page-enter">
                        {renderView()}
                    </div>
                </main>
            </div>
            <GovtBottomNav activeView={activeView} setActiveView={setActiveView} alerts={alerts} />
            <IssueDetailDrawer 
                issue={selectedIssue} 
                onClose={() => setSelectedIssue(null)}
                onAssign={handleAssignIssue}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default GovtDashboardPage;
