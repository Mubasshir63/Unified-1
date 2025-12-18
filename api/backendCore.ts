
import { 
    DetailedReport, SOSAlert, User, ReportStatus, 
    DataflowItem, TeamMember, Announcement, EmergencyContact,
    LocationData
} from '../types';

// --- DATABASE SCHEMA ---
interface UnifiedDatabase {
    users: User[];
    reports: DetailedReport[];
    sos: SOSAlert[];
    announcements: Announcement[];
    dataflow: DataflowItem[];
    team: TeamMember[];
    auditLogs: Array<{ timestamp: string; action: string; actor: string; targetId: string | number }>;
}

const DB_KEY = 'UNIFIED_PROD_DB_V1';

class BackendCore {
    private db: UnifiedDatabase;
    private listeners: Array<(event: string, data: any) => void> = [];

    constructor() {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
            this.db = JSON.parse(stored);
            // Migrate old DBs to include new official IDs if they don't exist
            this.ensureOfficialAccounts();
        } else {
            this.db = this.initializeDefaultDB();
            this.persist();
        }
    }

    private ensureOfficialAccounts() {
        const requiredEmails = ['mubasshir.mohamed@gov.in', 'hisham.mohamed@gov.in'];
        let updated = false;
        requiredEmails.forEach(email => {
            if (!this.db.users.find(u => u.email === email)) {
                this.db.users.push({
                    name: email.split('.')[0].toUpperCase(),
                    email: email,
                    phone: email === 'mubasshir.mohamed@gov.in' ? '9361855808' : '8637644352',
                    aadhaar: email === 'mubasshir.mohamed@gov.in' ? '123456789012' : '098765432109',
                    password: 'unified',
                    profilePicture: `https://i.pravatar.cc/150?u=${email}`,
                    role: 'official',
                    location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
                });
                updated = true;
            }
        });
        if (updated) this.persist();
    }

    private initializeDefaultDB(): UnifiedDatabase {
        return {
            users: [
                { 
                    name: 'Mubasshir', email: 'citizen@unified.gov', phone: '9361855808', aadhaar: '123456789012', 
                    password: 'password',
                    profilePicture: 'https://i.pravatar.cc/150?u=mub', role: 'citizen',
                    location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
                },
                { 
                    name: 'Mubasshir Mohamed', email: 'mubasshir.mohamed@gov.in', phone: '9361855808', aadhaar: '123456789012', 
                    password: 'unified',
                    profilePicture: 'https://i.pravatar.cc/150?u=mub_gov', role: 'official',
                    location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
                },
                { 
                    name: 'Hisham Mohamed', email: 'hisham.mohamed@gov.in', phone: '8637644352', aadhaar: '098765432109', 
                    password: 'unified',
                    profilePicture: 'https://i.pravatar.cc/150?u=hisham_gov', role: 'official',
                    location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
                }
            ],
            reports: [],
            sos: [],
            announcements: [
                { id: 1, title: 'Network Infrastructure Upgrade', content: 'City-wide fiber optics upgrade starting next week.', source: 'Admin', timestamp: new Date().toISOString(), status: ReportStatus.UnderReview }
            ],
            dataflow: [],
            team: [
                { id: 'off-1', name: 'Officer Arjun', role: 'Officer', avatar: 'https://i.pravatar.cc/150?u=arjun' }
            ],
            auditLogs: []
        };
    }

    private persist() {
        localStorage.setItem(DB_KEY, JSON.stringify(this.db));
    }

    // --- PUB/SUB ENGINE (SIMULATED WEBSOCKETS) ---
    public subscribe(callback: (event: string, data: any) => void) {
        this.listeners.push(callback);
        return () => { this.listeners = this.listeners.filter(l => l !== callback); };
    }

    private broadcast(event: string, data: any) {
        this.listeners.forEach(l => l(event, data));
        this.persist();
    }

    private log(action: string, actor: string, targetId: string | number) {
        this.db.auditLogs.unshift({ timestamp: new Date().toISOString(), action, actor, targetId });
    }

    // --- API IMPLEMENTATIONS ---

    public async login(id: string, pw: string, role: 'citizen' | 'official'): Promise<User | null> {
        const found = this.db.users.find(u => 
            (u.email === id || u.phone === id || u.aadhaar === id) && u.role === role
        );
        // Strict password check if password is set in DB
        if (found && found.password && found.password !== pw) return null;
        return found || null;
    }

    public async register(userData: Partial<User>): Promise<User> {
        const newUser = { 
            ...userData, 
            role: 'citizen', 
            profilePicture: `https://i.pravatar.cc/150?u=${userData.phone}`,
            email: `${userData.phone}@unified.user` 
        } as User;
        this.db.users.push(newUser);
        this.log('USER_REGISTERED', newUser.name, newUser.phone);
        this.broadcast('USER_UPDATED', newUser);
        return newUser;
    }

    public getReports(): DetailedReport[] {
        return this.db.reports;
    }

    public async createReport(data: any, user: User): Promise<DetailedReport> {
        const newReport: DetailedReport = {
            id: Date.now(),
            title: data.title,
            category: data.category,
            description: data.description,
            status: ReportStatus.UnderReview,
            date: new Date().toISOString(),
            location: data.location || "Current GPS",
            coords: data.coords,
            photo: data.photo,
            video: data.video,
            priority: data.priority || 'Medium',
            updates: [{ timestamp: new Date().toISOString(), message: 'Initial filing verified by Cloud Core', by: 'System' }]
        };
        this.db.reports.unshift(newReport);
        this.log('ISSUE_CREATED', user.name, newReport.id);
        this.broadcast('NEW_ISSUE', newReport);
        return newReport;
    }

    public async updateReport(id: number, updates: Partial<DetailedReport>, actor: string): Promise<DetailedReport | null> {
        const idx = this.db.reports.findIndex(r => r.id === id);
        if (idx === -1) return null;
        
        const updated = { ...this.db.reports[idx], ...updates };
        if (updates.status) {
            updated.updates.push({ 
                timestamp: new Date().toISOString(), 
                message: `Status transitioned to ${updates.status}`, 
                by: actor 
            });
            this.log('ISSUE_STATUS_CHANGE', actor, id);
        }
        
        this.db.reports[idx] = updated;
        this.broadcast('ISSUE_UPDATED', updated);
        return updated;
    }

    public async createSOS(user: User, video?: string): Promise<SOSAlert> {
        const alert: SOSAlert = {
            id: Date.now(),
            user: { name: user.name, phone: user.phone, profilePicture: user.profilePicture },
            timestamp: new Date().toISOString(),
            location: { address: 'Live GPS Ping', coords: user.location.coords },
            status: 'Active',
            recordedVideo: video
        };
        this.db.sos.unshift(alert);
        this.log('SOS_ACTIVATED', user.name, alert.id);
        this.broadcast('SOS_ALERT', alert);
        return alert;
    }

    public getSOS(): SOSAlert[] {
        return this.db.sos;
    }

    public async resolveSOS(id: number, actor: string) {
        this.db.sos = this.db.sos.filter(a => a.id !== id);
        this.log('SOS_RESOLVED', actor, id);
        this.broadcast('SOS_RESOLVED', id);
    }

    public async createDataflow(data: any): Promise<DataflowItem> {
        const item: DataflowItem = { 
            id: `FLOW-${Date.now()}`, 
            status: 'Received', 
            timestamp: new Date().toISOString(), 
            ...data 
        };
        this.db.dataflow.unshift(item);
        this.broadcast('DATAFLOW_NEW', item);

        // Simulate Async Cloud Processing
        setTimeout(() => {
            const flowIdx = this.db.dataflow.findIndex(i => i.id === item.id);
            if (flowIdx !== -1) {
                this.db.dataflow[flowIdx].status = 'Validating';
                this.broadcast('DATAFLOW_UPDATE', this.db.dataflow[flowIdx]);
            }
            
            setTimeout(() => {
                const finalIdx = this.db.dataflow.findIndex(i => i.id === item.id);
                if (finalIdx !== -1) {
                    this.db.dataflow[finalIdx].status = 'Forwarded';
                    this.broadcast('DATAFLOW_UPDATE', this.db.dataflow[finalIdx]);
                }
            }, 5000);
        }, 3000);

        return item;
    }

    public getAnnouncements(): Announcement[] {
        return this.db.announcements;
    }
}

export const cloudCore = new BackendCore();
