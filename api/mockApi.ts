
import { cloudCore } from './backendCore';
import { 
    DetailedReport, SOSAlert, User, ReportStatus, 
    Department, TeamMember, DataflowItem, CityPulse,
    Announcement
} from '../types';
import { GoogleGenAI } from "@google/genai";

// 1. Authentication
export const login = async (id: string, pw: string, role: 'citizen' | 'official'): Promise<User | null> => {
    return cloudCore.login(id, pw, role);
};

export const register = async (userData: any): Promise<User> => {
    return cloudCore.register(userData);
};

// 2. City Reports
export const getReports = async (): Promise<DetailedReport[]> => {
    return cloudCore.getReports();
};

export const createReport = async (data: any, user: User): Promise<DetailedReport> => {
    return cloudCore.createReport(data, user);
};

export const updateReport = async (id: number, updates: Partial<DetailedReport>, actor: string = 'Command Center'): Promise<DetailedReport | null> => {
    return cloudCore.updateReport(id, updates, actor);
};

// 3. SOS Integration
export const getSOSAlerts = async (): Promise<SOSAlert[]> => {
    return cloudCore.getSOS();
};

export const createSOSAlert = async (user: User, video?: string): Promise<SOSAlert> => {
    return cloudCore.createSOS(user, video);
};

export const deleteSOSAlert = async (id: number) => {
    return cloudCore.resolveSOS(id, 'Official');
};

// 4. Hub Specific Analytics
export const getDepartments = async (): Promise<Department[]> => {
    const reports = cloudCore.getReports();
    const categories: any[] = ['health', 'transport', 'sanitation', 'water', 'electricity', 'housing', 'safety', 'education', 'finance'];
    return categories.map(key => {
        const count = reports.filter((r: any) => r.category.toLowerCase().includes(key.substring(0, 4)) && r.status !== ReportStatus.Resolved).length;
        return {
            id: key,
            name: key.toUpperCase(),
            status: count > 5 ? 'Critical' : count > 2 ? 'Warning' : 'Normal',
            open_issues: count,
            avg_response_time: '1.2h'
        };
    });
};

// 5. Dataflow
export const getDataflowSubmissions = async () => {
    // Structured backend check
    const stored = localStorage.getItem('UNIFIED_PROD_DB_V1');
    return stored ? JSON.parse(stored).dataflow : [];
};

export const getUserDataflow = async (userName: string): Promise<DataflowItem[]> => {
    const data = await getDataflowSubmissions();
    return data.filter((item: any) => item.user.name === userName);
};

export const createDataflowSubmission = async (data: any) => {
    return cloudCore.createDataflow(data);
};

// 6. Communications
export const getAnnouncements = async () => cloudCore.getAnnouncements();

export const createAnnouncement = async (data: any) => {
    // Simplified for now, could be added to cloudCore if needed
    return { id: Date.now(), timestamp: 'Just now', ...data };
};

// 7. Intelligence & Pulse
export const getCityPulse = async (district: string): Promise<CityPulse> => {
    return {
        aqi: 42 + Math.floor(Math.random() * 15),
        aqiStatus: 'Good',
        trafficCongestion: 10 + Math.floor(Math.random() * 20),
        powerUptime: 99.8,
        waterUptime: 94.2,
        activeEvents: 12,
        temperature: 28 + Math.floor(Math.random() * 5)
    };
};

export const getAiBriefing = async (district: string, announcements: Announcement[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const annText = announcements.slice(0, 3).map(a => a.title).join(', ');
        const prompt = `Based on these city announcements: ${annText}, give a 1-sentence supportive briefing for a citizen of ${district}. Keep it under 20 words.`;
        const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
        return response.text.trim();
    } catch (e) {
        return `Your city ${district} is running smoothly. Check alerts for local updates.`;
    }
};

// --- Other mocks maintained for UI compatibility ---
export const getTeam = async () => [];
export const getResolvedIssues = async () => [];
export const getDonations = async () => [];
export const getGovtSchemes = async (s: string) => [];
export const scanUrl = async (u: string) => ({ url: u, isSafe: true, riskScore: 0 });
export const checkDataBreach = async (e: string) => [];
export const getCriminalNetwork = async () => ({ nodes: [], links: [] });
export const getEmergencyContacts = async () => [];
export const addEmergencyContact = async (n: string, p: string) => ({ id: Date.now(), name: n, phone: p });
export const deleteEmergencyContact = async (id: number) => true;
export const getAiSuggestion = async (i: any) => "Analyzed: Immediate priority recommended.";
export const getCyberReports = async () => [];
export const simulateIncomingThreat = async () => ({ sender: 'Unknown', content: 'Suspicious link', platform: 'SMS', timestamp: new Date().toISOString(), detectedCategory: 'Phishing', threatLevel: 'Medium' });
export const addTeamMember = async (d: any) => ({ id: '1', ...d });
export const updateTeamMember = async (m: any) => m;
export const deleteTeamMember = async (id: any) => true;
export const changePassword = async (e: any, c: any, n: any) => true;
export const updateUser = async (u: any) => u;
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

export const mockAnnouncements = [];
export const mockDonations = [];
export const mockResolvedIssues = [];
