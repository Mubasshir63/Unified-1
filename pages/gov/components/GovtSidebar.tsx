
import React, { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { GovtView } from '../../../types';
import { 
    HomeIcon, MyReportsIcon, MapIcon, SOSIcon, LogoutIcon, ChartBarIcon, UsersIcon, MegaphoneIcon, DataFlowIcon,
    HeartIcon, TransportIcon, WasteTrackerIcon, WaterLeakIcon, StreetlightIcon, BuildingOfficeIcon,
    ShieldIcon, WrenchIcon, PayBillsIcon, KeyIcon, CCTVIcon, LockClosedIcon
} from '../../../components/icons/NavIcons';
import type { SOSAlert } from '../../../types';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  alertCount?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, alertCount }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 relative ${
        isActive
          ? 'bg-teal-600 text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      <div className="w-6 h-6 mr-3">{icon}</div>
      <span>{label}</span>
      {alertCount && alertCount > 0 ? (
         <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse-sos">
            {alertCount}
        </span>
      ) : null}
    </button>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-4 pt-4 pb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">{title}</h3>
);

const GovtSidebar: React.FC<{ activeView: GovtView; setActiveView: (view: GovtView) => void; alerts: SOSAlert[] }> = ({ activeView, setActiveView, alerts }) => {
    const { user, logout } = useContext(UserContext);
    const activeAlerts = alerts.filter(a => a.status === 'Active').length;
    
    const navItems = {
        main: [
            { id: 'control-room', label: 'Control Room', icon: <HomeIcon /> },
            { id: 'issues', label: 'Issue Tracker', icon: <MyReportsIcon className="w-6 h-6"/> },
            { id: 'cctv-grid', label: 'CCTV Grid', icon: <CCTVIcon /> },
            { id: 'sos', label: 'SOS Alerts', icon: <SOSIcon />, alertCount: activeAlerts },
            { id: 'map', label: 'City Map', icon: <MapIcon /> },
        ],
        departments: [
            { id: 'health', label: 'Health', icon: <HeartIcon className="w-6 h-6" /> },
            { id: 'transport', label: 'Transport', icon: <TransportIcon /> },
            { id: 'sanitation', label: 'Sanitation', icon: <WasteTrackerIcon /> },
            { id: 'water', label: 'Water', icon: <WaterLeakIcon /> },
            { id: 'electricity', label: 'Electricity', icon: <StreetlightIcon /> },
            { id: 'housing', label: 'Housing', icon: <BuildingOfficeIcon /> },
            { id: 'safety', label: 'Safety & Police', icon: <ShieldIcon /> },
            { id: 'public-works', label: 'Public Works', icon: <WrenchIcon className="w-6 h-6" /> },
            { id: 'finance', label: 'Finance', icon: <PayBillsIcon /> },
            { id: 'education', label: 'Education', icon: <UsersIcon /> }, // Re-using for now
        ],
        system: [
            { id: 'cyber-crime', label: 'Cyber Crime Unit', icon: <LockClosedIcon className="w-6 h-6" /> },
            { id: 'analytics', label: 'Analytics', icon: <ChartBarIcon /> },
            { id: 'team', label: 'Team Management', icon: <UsersIcon /> },
            { id: 'communications', label: 'Communications', icon: <MegaphoneIcon /> },
            { id: 'dataflow', label: 'Data Flow', icon: <DataFlowIcon /> },
            { id: 'administration', label: 'Administration', icon: <KeyIcon /> },
        ]
    };
    
    return (
        <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col flex-shrink-0 shadow-2xl h-dvh">
            <div className="h-[65px] border-b border-slate-800/50 flex items-center px-4">
                <div className="flex items-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <defs><linearGradient id="govLogoGradientSidebar" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#0d9488"/></linearGradient></defs>
                        <circle cx="12" cy="12" r="11" fill="url(#govLogoGradientSidebar)"/>
                        <path d="M12 4L4 8v5c0 4.4 3.58 8.25 8 9.25 4.42-1 8-4.85 8-9.25V8l-8-4zm0 1.5l6 3v4.5c0 3.32-2.67 6.18-6 6.92-3.33-.74-6-3.6-6-6.92V8.5l6-3zM12 12l3.5-2-1.5 4h-4l-1.5-4z" fill="white"/>
                    </svg>
                    <div>
                        <h1 className="text-lg font-bold text-white">UNIFIED</h1>
                        <p className="text-xs font-semibold text-teal-400 -mt-1">Govt. Hub</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                <SectionHeader title="Main" />
                {navItems.main.map(item => (
                    <NavItem 
                        key={item.id} 
                        label={item.label}
                        icon={item.icon}
                        isActive={activeView === item.id}
                        onClick={() => setActiveView(item.id as GovtView)}
                        alertCount={item.alertCount}
                    />
                ))}
                <SectionHeader title="Departments" />
                 {navItems.departments.map(item => (
                    <NavItem 
                        key={item.id} 
                        label={item.label}
                        icon={item.icon}
                        isActive={activeView === item.id}
                        onClick={() => setActiveView(item.id as GovtView)}
                    />
                ))}
                 <SectionHeader title="System" />
                 {navItems.system.map(item => (
                    <NavItem 
                        key={item.id} 
                        label={item.label}
                        icon={item.icon}
                        isActive={activeView === item.id}
                        onClick={() => setActiveView(item.id as GovtView)}
                    />
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800/50">
                <button onClick={() => setActiveView('profile')} className="w-full flex items-center space-x-3 mb-4 p-2 rounded-lg hover:bg-slate-800">
                     <img src={user?.profilePicture} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-slate-500" />
                     <div className="text-left">
                         <p className="font-semibold text-sm">{user?.name}</p>
                         <p className="text-xs text-slate-400">Control Room Operator</p>
                     </div>
                </button>
                 <button onClick={logout} className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold bg-slate-800/50 text-slate-300 rounded-lg hover:bg-red-500/80 hover:text-white transition-colors">
                     <LogoutIcon className="w-5 h-5 mr-2" />
                     Logout
                 </button>
            </div>
        </aside>
    );
};

export default GovtSidebar;
