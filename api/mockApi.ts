
import { cloudCore } from './backendCore';
import { 
    DetailedReport, SOSAlert, User, ReportStatus, 
    Department, TeamMember, DataflowItem, CityPulse,
    Announcement, DonationRequest, ResolvedIssue, InterceptedMessage
} from '../types';

export const login = async (id: string, pw: string, role: 'citizen' | 'official'): Promise<User | null> => {
    return cloudCore.login(id, pw, role);
};

export const register = async (userData: any): Promise<User> => {
    return cloudCore.register(userData);
};

export const getReports = async (): Promise<DetailedReport[]> => {
    return cloudCore.getReports();
};

export const createReport = async (data: any, user: User): Promise<DetailedReport> => {
    return cloudCore.createReport(data, user);
};

export const updateReport = async (id: number, updates: Partial<DetailedReport>, actor: string = 'Command Center'): Promise<DetailedReport | null> => {
    return cloudCore.updateReport(id, updates, actor);
};

export const getSOSAlerts = async (): Promise<SOSAlert[]> => {
    return cloudCore.getSOS();
};

export const createSOSAlert = async (user: User, video?: string): Promise<SOSAlert> => {
    return cloudCore.createSOS(user, video);
};

export const resolveSOSAlert = async (id: number) => {
    return cloudCore.resolveSOS(id, 'Official');
};

export const getAnnouncements = async () => cloudCore.getAnnouncements();

export const mockAnnouncements: Announcement[] = [
    { id: 101, title: 'CMRL Phase 2: OMR Corridor', content: 'Chennai Metro work on OMR begins today. Please use ECR for alternate travel.', source: 'Chennai Metro Rail Ltd.', timestamp: new Date().toISOString(), status: ReportStatus.UnderReview },
    { id: 102, title: 'TANGEDCO Maintenance Alert', content: 'Scheduled power maintenance for Western districts this Sunday from 9 AM to 4 PM.', source: 'TNEB / TANGEDCO', timestamp: new Date().toISOString(), status: ReportStatus.Emergency },
    { id: 103, title: 'GCC Water Supply Update', content: 'Water supply lines cleaned for Velachery zone. Normal supply restored.', source: 'Greater Chennai Corporation', timestamp: new Date().toISOString(), status: ReportStatus.Resolved }
];

export const createAnnouncement = async (data: Omit<Announcement, 'id' | 'timestamp'>): Promise<Announcement> => {
    const newAnn: Announcement = { ...data, id: Date.now(), timestamp: new Date().toISOString() };
    return newAnn;
};

export const getDepartments = async (): Promise<Department[]> => {
    const reports = cloudCore.getReports();
    const categories: any[] = ['health', 'transport', 'sanitation', 'water', 'electricity', 'housing', 'safety', 'public-works', 'finance', 'education'];
    return categories.map(key => ({
        id: key,
        name: key === 'electricity' ? 'TANGEDCO' : key === 'water' ? 'TWAD Board' : key === 'sanitation' ? 'GCC / Corporation' : key.toUpperCase().replace('-', ' '),
        status: reports.filter(r => r.priority === 'Critical' && r.status !== ReportStatus.Resolved).length > 2 ? 'Critical' : 'Normal',
        open_issues: reports.filter(r => r.category.toLowerCase().includes(key.substring(0,3))).length,
        avg_response_time: '1.2h'
    }));
};

export const getCityPulse = async (district: string): Promise<CityPulse> => {
    return { aqi: 48, aqiStatus: 'Good', trafficCongestion: 22, powerUptime: 99.8, waterUptime: 97.5, activeEvents: 3, temperature: 31 };
};

export const getAiBriefing = async (district: string, announcements: Announcement[]): Promise<string> => {
    return `Vanakkam ${district}! The Tamil Nadu Smart Core is healthy. Heritage Note: Did you know that Coimbatore is known as the 'Manchester of South India'? Civic infrastructure remains stable; TANGEDCO reports 99.9% uptime for the southern grid.`;
};

// --- CYBER SECURITY MOCKS ---
export const scanUrl = async (url: string) => ({ url, isSafe: !url.includes('phish'), riskScore: url.includes('phish') ? 85 : 5, hostLocation: 'Unknown', analysis: 'Scanning behavioral patterns...' });
export const checkDataBreach = async (email: string) => [];
export const simulateIncomingThreat = async (): Promise<InterceptedMessage> => ({
    sender: '+91 94440 12345',
    content: 'TANGEDCO: Your power will be disconnected. Pay bill immediately at: bit.ly/fake-tneb-pay',
    platform: 'SMS',
    timestamp: new Date().toISOString(),
    detectedCategory: 'Financial Scam / Fraud',
    threatLevel: 'High'
});

export const getTeam = async () => [];
export const addTeamMember = async (d: any) => ({ id: Date.now().toString(), ...d });
export const updateTeamMember = async (m: any) => m;
export const deleteTeamMember = async (id: any) => true;
export const updateUser = async (u: any) => u;
export const changePassword = async (e: string, cp: string, np: string) => true;
export const getEmergencyContacts = async () => [];
export const addEmergencyContact = async (n: string, p: string) => ({ id: Date.now(), name: n, phone: p });
export const deleteEmergencyContact = async (id: number) => true;
export const getAiSuggestion = async (i: any) => "Forward this to the nearest Greater Chennai Corporation (GCC) zonal office for immediate site inspection.";
export const getCyberReports = async () => [];
export const getCriminalNetwork = async () => ({ nodes: [], links: [] });
export const mockResolvedIssues: ResolvedIssue[] = [
    { id: 1, title: 'Streetlight Fixed', category: 'Electricity', resolvedDate: '2 hours ago', location: 'T-Nagar' },
    { id: 2, title: 'Pothole Patched', category: 'Public Works', resolvedDate: '5 hours ago', location: 'Adyar' }
];
export const mockDonations: DonationRequest[] = [];
export const getResolvedIssues = async () => mockResolvedIssues;
export const getDonations = async () => mockDonations;
export const getGovtSchemes = async (s: string) => [];
export const getDataflowSubmissions = async () => [];
export const createDataflowSubmission = async (d: any) => true;
export const getUserDataflow = async (n: string) => [];
export const getHealthData = async () => ({ doctors: [], hospitals: [] });
export const getTransportStaff = async () => [];
export const getSanitationWorkers = async () => [];
export const getWaterStaff = async () => [];
export const getElectricityStaff = async () => [];
export const getHousingStaff = async () => [];
export const getPoliceOfficers = async () => [];
export const getPublicWorksStaff = async () => [];
export const getFinanceStaff = async () => [];
export const getEducationData = async () => ({ teachers: [], schools: [] });
