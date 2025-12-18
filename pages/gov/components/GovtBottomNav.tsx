import React from 'react';
import { GovtView } from '../../../types';
import { HomeIcon, MyReportsIcon, MapIcon, SOSIcon, UsersIcon } from '../../../components/icons/NavIcons';
import type { SOSAlert } from '../../../types';

interface GovtBottomNavProps {
  activeView: GovtView;
  setActiveView: (view: GovtView) => void;
  alerts: SOSAlert[];
}

const NavItem: React.FC<{
  label: string;
  Icon: React.ElementType<{ isActive?: boolean, className?: string }>;
  isActive: boolean;
  onClick: () => void;
  alertCount?: number;
}> = ({ label, Icon, isActive, onClick, alertCount }) => {
  
  const activeClasses = "text-teal-400";
  const inactiveClasses = "text-slate-400 hover:text-teal-400";
  
  return (
    <button onClick={onClick} className={`flex-1 flex flex-col items-center justify-center space-y-1 transition-colors duration-200 relative ${isActive ? activeClasses : inactiveClasses}`}>
      <div className={`absolute -top-1.5 h-1 w-8 rounded-full bg-teal-400 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      <Icon isActive={isActive} className={`w-6 h-6`} />
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
      {alertCount && alertCount > 0 ? (
         <span className="absolute top-1 right-4 w-5 h-5 bg-red-500 text-white text-[10px] leading-tight rounded-full flex items-center justify-center animate-pulse-sos">
            {alertCount}
        </span>
      ) : null}
    </button>
  );
};

const GovtBottomNav: React.FC<GovtBottomNavProps> = ({ activeView, setActiveView, alerts }) => {
  const navItems = [
    { id: 'control-room', label: 'Control', Icon: HomeIcon },
    { id: 'issues', label: 'Issues', Icon: MyReportsIcon },
    { id: 'sos', label: 'SOS', Icon: SOSIcon, alertCount: alerts.filter(a => a.status === 'Active').length },
    { id: 'map', label: 'Map', Icon: MapIcon },
    { id: 'administration', label: 'Admin', Icon: UsersIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-700 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around z-30">
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          {...item}
          isActive={activeView === item.id}
          onClick={() => setActiveView(item.id as GovtView)}
        />
      ))}
    </div>
  );
};

export default GovtBottomNav;