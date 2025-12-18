import React from 'react';
import { Page } from '../types';
import { HomeIcon, ServicesIcon, MapIcon, ReportIcon, ProfileIcon } from './icons/NavIcons';
import { useTranslation } from '../hooks/useTranslation';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  Icon: React.ElementType<{ isActive?: boolean, className?: string }>;
  isActive: boolean;
  onClick: () => void;
  isCenter?: boolean;
  id?: string;
}> = ({ page, label, Icon, isActive, onClick, isCenter = false, id }) => {
  
  const activeClasses = "text-green-600";
  const inactiveClasses = "text-gray-500 hover:text-green-500";
  const centerActiveGlow = "shadow-[0_0_20px_rgba(34,197,94,0.7)]";

  if (isCenter) {
    return (
      <button 
        id={id}
        onClick={onClick}
        aria-label={label}
        className={`relative flex items-center justify-center -mt-10 rounded-full bg-white h-16 w-16 transition-all duration-300 transform hover:scale-110 ${isActive ? centerActiveGlow : 'shadow-md'}`}
      >
        <div className={`flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-green-500 to-green-600`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </button>
    );
  }
  
  return (
    <button id={id} onClick={onClick} className={`flex-1 flex flex-col items-center justify-center space-y-1 transition-colors duration-200 relative ${isActive ? activeClasses : inactiveClasses}`}>
      <div className={`absolute -top-1.5 h-1 w-8 rounded-full bg-green-500 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
      <Icon isActive={isActive} className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const { t } = useTranslation();
  
  const navItems = [
    { page: Page.Home, label: t('home'), Icon: HomeIcon, id: 'home-nav-item' },
    { page: Page.Services, label: t('services'), Icon: ServicesIcon, id: 'services-nav-item' },
    { page: Page.Map, label: t('mapView'), Icon: MapIcon, isCenter: true, id: 'map-nav-item' },
    { page: Page.Report, label: t('report'), Icon: ReportIcon, id: 'report-nav-item' },
    { page: Page.Profile, label: t('profile'), Icon: ProfileIcon, id: 'profile-nav-item' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around z-50">
      {navItems.map((item) => (
        <NavItem
          key={item.page}
          {...item}
          isActive={currentPage === item.page}
          onClick={() => setCurrentPage(item.page)}
        />
      ))}
    </div>
  );
};

export default BottomNav;