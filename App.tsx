import React, { useState, useEffect, useMemo } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import MapPage from './pages/MapPage';
import ReportPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/BottomNav';
import { UserContext } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationsProvider, useNotifications } from './contexts/NotificationsContext';
import type { User, DetailedReport, SOSAlert, SOSState } from './types';
import { Page, ReportStatus } from './types';
import Header from './components/Header';
import NotificationsPanel from './components/NotificationsPanel';
import { useTranslation } from './hooks/useTranslation';
import * as mockApi from './api/mockApi';
import { cloudCore } from './api/backendCore';

// Service Pages
import GovtPortalsPage from './pages/services/GovtPortalsPage';
import ComplaintRegistrationPage from './pages/services/ComplaintRegistrationPage';
import WaterPowerPage from './pages/services/WaterPowerPage';
import TransportInfoPage from './pages/services/TransportInfoPage';
import WasteTrackerPage from './pages/services/WasteTrackerPage';
import MedicalHelpPage from './pages/services/MedicalHelpPage';
import LocalEventsPage from './pages/services/LocalEventsPage';
import VolunteerPage from './pages/services/VolunteerPage';
import DownloadCenterPage from './pages/services/DownloadCenterPage';
import GovtSchemesPage from './pages/services/GovtSchemesPage';
import LegalHelpPage from './pages/services/LegalHelpPage';
import AadhaarServicesPage from './pages/services/AadhaarServicesPage';
import PassportSevaPage from './pages/services/PassportSevaPage';
import FindBloodBanksPage from './pages/services/FindBloodBanksPage';
import BookVaccinationPage from './pages/services/BookVaccinationPage';
import EmergencyAmbulancePage from './pages/services/EmergencyAmbulancePage';
import MetroCardRechargePage from './pages/services/MetroCardRechargePage';
import ParkingFinderPage from './pages/services/ParkingFinderPage';
import NewConnectionPage from './pages/services/NewConnectionPage';
import CommunityCentersPage from './pages/services/CommunityCentersPage';
import PropertyTaxPage from './pages/services/PropertyTaxPage';
import LandRecordsPage from './pages/services/LandRecordsPage';
import SchoolAdmissionsPage from './pages/services/SchoolAdmissionsPage';
import PublicLibrariesPage from './pages/services/PublicLibrariesPage';
import DigitalLockerPage from './pages/services/DigitalLockerPage';
import CyberSafetyPage from './pages/services/CyberSafetyPage';
import MomsCarePage from './pages/services/MomsCarePage';

// Common Components
import ServiceTransition from './components/ServiceTransition';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import AiAssistantModal from './components/AiAssistantModal';
import SOSModal from './components/SOSModal';
import EditProfileModal from './components/EditProfileModal';
import ReportDetailModal from './components/ReportDetailModal';
import SOSDetailModal from './components/SOSDetailModal';

// Views
import AllAnnouncementsPage from './pages/home/AllAnnouncementsPage';
import AllReportsPage from './pages/profile/AllReportsPage';
import SOSHistoryPage from './pages/profile/SOSHistoryPage';
import GovtDashboardPage from './pages/gov/GovtDashboardPage';
import AboutUsPage from './pages/profile/AboutUsPage';
import AccountSettingsPage from './pages/profile/AccountSettingsPage';
import HelpAndSupportPage from './pages/profile/HelpAndSupportPage';
import EmergencyContactsPage from './pages/profile/EmergencyContactsPage';
import TrackApplicationsPage from './pages/profile/TrackApplicationsPage';
import RequestMedicalHelpPage from './pages/profile/RequestMedicalHelpPage';

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, _setCurrentPage] = useState<Page>(Page.Home);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [transitioningService, setTransitioningService] = useState<string | null>(null);
  const [activeHomePageView, setActiveHomePageView] = useState<string>('dashboard');
  const [activeProfilePageView, setActiveProfilePageView] = useState<string>('dashboard');
  const [modalReport, setModalReport] = useState<DetailedReport | null>(null);
  const [modalSosAlert, setModalSosAlert] = useState<SOSAlert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isVoiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [mapFilter, setMapFilter] = useState<string | null>(null);
  const [sosModalState, setSosModalState] = useState<{open: boolean, initialState: SOSState}>({open: false, initialState: 'idle'});
  
  const [reports, setReports] = useState<DetailedReport[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  const notifications = useNotifications();
  const { t } = useTranslation();

  useEffect(() => {
    setReports(cloudCore.getReports());
    setSosAlerts(cloudCore.getSOS());

    const unsubscribe = cloudCore.subscribe((event, data) => {
        setReports(cloudCore.getReports());
        setSosAlerts(cloudCore.getSOS());

        if (user?.role === 'official') {
            if (event === 'SOS_ALERT') notifications.showToast(`🚨 CRITICAL SOS: ${data.user.name.toUpperCase()}`);
            if (event === 'NEW_ISSUE') notifications.addNotification('System Alert', `New ${data.category} report filed.`, Page.Home);
        }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewSOSAlert = async (video: string) => {
    if (!user) return;
    await cloudCore.createSOS(user, video);
    notifications.addNotification('SOS Active', 'Location broadcast started.', Page.Profile);
  };

  const handleCreateNewIssue = async (newIssueData: any) => {
      if (!user) return;
      await cloudCore.createReport(newIssueData, user);
      notifications.showToast('Issue pushed to command center.');
  };

  const setCurrentPage = (page: Page) => {
    if (page !== currentPage) {
      setActiveService(null);
      setActiveHomePageView('dashboard');
      setActiveProfilePageView('dashboard');
    }
    _setCurrentPage(page);
  };

  const navigateToService = (serviceId: string) => {
    if (serviceId === 'fileNewReport') { setCurrentPage(Page.Report); return; }
    setTransitioningService(serviceId);
  };
  
  const handleTransitionEnd = (serviceId: string) => {
      _setCurrentPage(Page.Services);
      setActiveService(serviceId);
      setTransitioningService(null);
  };

  const handleLogin = async (id: string, pw: string) => {
    const loggedInUser = await mockApi.login(id, pw, 'citizen');
    if(loggedInUser) { setUser(loggedInUser); setCurrentPage(Page.Home); } 
    else notifications.showToast('Invalid ID or Password.');
  };
  
  const handleGovLogin = async (email: string, pw: string) => {
    const loggedInUser = await mockApi.login(email, pw, 'official');
    if(loggedInUser) setUser(loggedInUser);
    else notifications.showToast('Government Access Denied.');
  };

  const userContextValue = useMemo(() => ({ user, setUser, logout: () => setUser(null) }), [user]);

  if (showSplash) return <SplashScreen />;
  if (transitioningService) return <ServiceTransition serviceKey={transitioningService} onTransitionEnd={() => handleTransitionEnd(transitioningService)} />;

  return (
    <UserContext.Provider value={userContextValue}>
      <div className="h-full bg-gray-50 text-gray-800 antialiased overflow-hidden">
        {!user ? (
          <LoginPage onLogin={handleLogin} onGovLogin={handleGovLogin} onRegister={(u) => cloudCore.register(u).then(setUser)} />
        ) : user.role === 'official' ? (
          <GovtDashboardPage reports={reports} alerts={sosAlerts} onUpdateReportStatus={cloudCore.updateReport.bind(cloudCore)} onAssignReport={cloudCore.updateReport.bind(cloudCore)} onSOSAction={cloudCore.resolveSOS.bind(cloudCore)} />
        ) : (
          <div className="relative pb-16 h-dvh w-full flex flex-col">
            <Header user={user} unreadCount={notifications.unreadCount} searchQuery={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} onNotificationsClick={() => setNotificationsOpen(true)} onProfileClick={() => setCurrentPage(Page.Profile)} onAiAssistantClick={() => setAiAssistantOpen(true)} onVoiceAssistantClick={() => setVoiceAssistantOpen(true)} searchPlaceholder={t('searchPlaceholder')} />
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} onNavigate={setCurrentPage} />
            <main className="flex-1 overflow-y-auto">
              <div key={currentPage + activeProfilePageView + activeHomePageView + (activeService || '')} className="animate-page-enter h-full">
                {currentPage === Page.Home && (activeHomePageView === 'dashboard' ? <HomePage setCurrentPage={setCurrentPage} navigateToService={navigateToService} setView={setActiveHomePageView} searchQuery={searchQuery} triggerSosFlow={() => setSosModalState({open: true, initialState: 'countdown'})} /> : <AllAnnouncementsPage onBack={() => setActiveHomePageView('dashboard')} />)}
                {currentPage === Page.Services && (
                    !activeService ? <ServicesPage onSelectService={navigateToService} setCurrentPage={setCurrentPage} searchQuery={searchQuery} /> :
                    activeService === 'govtPortals' ? <GovtPortalsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'complaintRegistration' ? <ComplaintRegistrationPage onBack={() => setActiveService(null)} onCreateIssue={handleCreateNewIssue} /> :
                    activeService === 'waterPower' ? <WaterPowerPage onBack={() => setActiveService(null)} onCreateIssue={handleCreateNewIssue} /> :
                    activeService === 'transportInfo' ? <TransportInfoPage onBack={() => setActiveService(null)} /> :
                    activeService === 'wasteTracker' ? <WasteTrackerPage onBack={() => setActiveService(null)} onCreateIssue={handleCreateNewIssue} /> :
                    activeService === 'medicalHelp' ? <MedicalHelpPage onBack={() => setActiveService(null)} /> :
                    activeService === 'localEvents' ? <LocalEventsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'volunteer' ? <VolunteerPage onBack={() => setActiveService(null)} /> :
                    activeService === 'downloadCenter' ? <DownloadCenterPage onBack={() => setActiveService(null)} /> :
                    activeService === 'govtSchemes' ? <GovtSchemesPage onBack={() => setActiveService(null)} /> :
                    activeService === 'legalHelp' ? <LegalHelpPage onBack={() => setActiveService(null)} onLaunchAiAssistant={() => setAiAssistantOpen(true)} /> :
                    activeService === 'aadhaarServices' ? <AadhaarServicesPage onBack={() => setActiveService(null)} /> :
                    activeService === 'passportSeva' ? <PassportSevaPage onBack={() => setActiveService(null)} /> :
                    activeService === 'findBloodBanks' ? <FindBloodBanksPage onBack={() => setActiveService(null)} /> :
                    activeService === 'bookVaccination' ? <BookVaccinationPage onBack={() => setActiveService(null)} /> :
                    activeService === 'emergencyAmbulance' ? <EmergencyAmbulancePage onBack={() => setActiveService(null)} /> :
                    activeService === 'metroCardRecharge' ? <MetroCardRechargePage onBack={() => setActiveService(null)} /> :
                    activeService === 'parkingFinder' ? <ParkingFinderPage onBack={() => setActiveService(null)} /> :
                    activeService === 'newConnection' ? <NewConnectionPage onBack={() => setActiveService(null)} /> :
                    activeService === 'communityCenters' ? <CommunityCentersPage onBack={() => setActiveService(null)} /> :
                    activeService === 'propertyTax' ? <PropertyTaxPage onBack={() => setActiveService(null)} /> :
                    activeService === 'landRecords' ? <LandRecordsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'schoolAdmissions' ? <SchoolAdmissionsPage onBack={() => setActiveService(null)} /> :
                    activeService === 'publicLibraries' ? <PublicLibrariesPage onBack={() => setActiveService(null)} /> :
                    activeService === 'digitalLocker' ? <DigitalLockerPage onBack={() => setActiveService(null)} /> :
                    activeService === 'cyberSafety' ? <CyberSafetyPage onBack={() => setActiveService(null)} /> :
                    activeService === 'momsCare' ? <MomsCarePage onBack={() => setActiveService(null)} navigateToMapWithFilter={(f) => { setMapFilter(f); setCurrentPage(Page.Map); }} /> :
                    <ServicesPage onSelectService={navigateToService} setCurrentPage={setCurrentPage} searchQuery={searchQuery} />
                )}
                {currentPage === Page.Map && <MapPage userLocation={user.location} reports={reports} setCurrentPage={setCurrentPage} filter={mapFilter} onClearFilter={() => setMapFilter(null)} />}
                {currentPage === Page.Report && <ReportPage onAddNewReport={handleCreateNewIssue} />}
                {currentPage === Page.Profile && (
                    activeProfilePageView === 'dashboard' ? <ProfilePage setView={setActiveProfilePageView} onEditProfileClick={() => setEditProfileOpen(true)} navigateToMapWithFilter={(f) => { setMapFilter(f); setCurrentPage(Page.Map); }} /> : 
                    activeProfilePageView === 'allReports' ? <AllReportsPage reports={reports} onBack={() => setActiveProfilePageView('dashboard')} onSelectReport={setModalReport} /> : 
                    activeProfilePageView === 'sosHistory' ? <SOSHistoryPage alerts={sosAlerts} onBack={() => setActiveProfilePageView('dashboard')} onSelectAlert={setModalSosAlert} /> : 
                    activeProfilePageView === 'accountSettings' ? <AccountSettingsPage onBack={() => setActiveProfilePageView('dashboard')} /> : 
                    activeProfilePageView === 'aboutUs' ? <AboutUsPage onBack={() => setActiveProfilePageView('dashboard')} /> : 
                    activeProfilePageView === 'helpSupport' ? <HelpAndSupportPage onBack={() => setActiveProfilePageView('dashboard')} /> : 
                    activeProfilePageView === 'emergencyContacts' ? <EmergencyContactsPage onBack={() => setActiveProfilePageView('dashboard')} /> : 
                    activeProfilePageView === 'trackApplications' ? <TrackApplicationsPage onBack={() => setActiveProfilePageView('dashboard')} /> : 
                    activeProfilePageView === 'requestMedicalHelp' ? <RequestMedicalHelpPage onBack={() => setActiveProfilePageView('dashboard')} onSubmit={(d) => { notifications.showToast('Medical request submitted.'); setActiveProfilePageView('dashboard'); }} /> : 
                    <ProfilePage setView={setActiveProfilePageView} onEditProfileClick={() => setEditProfileOpen(true)} navigateToMapWithFilter={(f) => { setMapFilter(f); setCurrentPage(Page.Map); }} />
                )}
              </div>
            </main>
            <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {modalReport && <ReportDetailModal report={modalReport} onClose={() => setModalReport(null)} />}
            {modalSosAlert && <SOSDetailModal alert={modalSosAlert} onClose={() => setModalSosAlert(null)} />}
            {isAiAssistantOpen && <AiAssistantModal onClose={() => setAiAssistantOpen(false)} />}
            {isVoiceAssistantOpen && <VoiceAssistantModal onClose={() => setVoiceAssistantOpen(false)} onCommand={(cmd) => { 
                if (cmd.action === 'navigateToPage') setCurrentPage(cmd.payload.page);
                if (cmd.action === 'navigateToService') navigateToService(cmd.payload.serviceId);
                setVoiceAssistantOpen(false);
            }} />}
            {isEditProfileOpen && <EditProfileModal user={user} onClose={() => setEditProfileOpen(false)} onSave={(u) => { cloudCore.register(u).then(setUser); setEditProfileOpen(false); }} />}
            {sosModalState.open && <SOSModal onClose={() => setSosModalState({open: false, initialState: 'idle'})} initialState={sosModalState.initialState} onActivate={handleNewSOSAlert} />}
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <NotificationsProvider>
      <AppContent />
    </NotificationsProvider>
  </LanguageProvider>
);

export default App;