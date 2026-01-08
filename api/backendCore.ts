
import { 
    DetailedReport, SOSAlert, User, ReportStatus, 
    DataflowItem, TeamMember, Announcement,
    LocationData
} from '../types';

interface UnifiedDatabase {
    users: User[];
    reports: DetailedReport[];
    sos: SOSAlert[];
    announcements: Announcement[];
}

const DB_KEY = 'UNIFIED_TN_CORE_V1';

class BackendCore {
    private db: UnifiedDatabase;
    private listeners: Array<(event: string, data: any) => void> = [];
    private syncChannel: BroadcastChannel;

    constructor() {
        this.syncChannel = new BroadcastChannel('unified_stealth_sync');
        const stored = localStorage.getItem(DB_KEY);
        
        this.db = stored ? JSON.parse(stored) : {
            users: [],
            reports: [],
            sos: [],
            announcements: [
                { id: 1, title: 'Tamil Nadu Smart Network Active', content: 'Connecting 38 districts in real-time.', source: 'Command Center', timestamp: new Date().toISOString(), status: ReportStatus.Resolved }
            ]
        };

        this.syncChannel.onmessage = (event) => {
            if (event.data.type === 'SYNC') {
                this.db = event.data.payload;
                this.broadcastLocal('CLOUD_SYNC', this.db);
            }
        };

        this.ensureOfficialAccounts();
    }

    private ensureOfficialAccounts() {
        const officials = [
            { name: 'MUBASSHIR', email: 'mubasshir.mohamed@gov.in' },
            { name: 'HISHAM', email: 'hisham.mohamed@gov.in' }
        ];
        officials.forEach(off => {
            if (!this.db.users.find(u => u.email === off.email)) {
                this.db.users.push({
                    name: off.name, email: off.email, phone: '9999988888',
                    aadhaar: '123456781234', password: 'unified',
                    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${off.name}`,
                    role: 'official',
                    location: { country: 'India', state: 'Tamil Nadu', district: 'Chennai', coords: { lat: 13.0827, lng: 80.2707 } }
                });
            }
        });
        this.persist();
    }

    private persist() {
        localStorage.setItem(DB_KEY, JSON.stringify(this.db));
        this.syncChannel.postMessage({ type: 'SYNC', payload: this.db });
    }

    private broadcastLocal(event: string, data: any) {
        this.listeners.forEach(l => l(event, data));
    }

    public subscribe(callback: (event: string, data: any) => void) {
        this.listeners.push(callback);
        return () => { this.listeners = this.listeners.filter(l => l !== callback); };
    }

    public async login(id: string, pw: string, role: 'citizen' | 'official'): Promise<User | null> {
        return this.db.users.find(u => (u.phone === id || u.email === id) && u.role === role && u.password === pw) || null;
    }

    public async register(userData: Partial<User>): Promise<User> {
        const newUser = { 
            ...userData, role: 'citizen', 
            profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
            email: `${userData.phone}@unified.user` 
        } as User;
        this.db.users.push(newUser);
        this.persist();
        return newUser;
    }

    public getReports() { return [...this.db.reports]; }
    public getSOS() { return [...this.db.sos]; }
    public getAnnouncements() { return this.db.announcements; }

    public async createReport(data: any, user: User) {
        const newReport: DetailedReport = {
            id: Date.now(), title: data.title, category: data.category, description: data.description,
            status: ReportStatus.UnderReview, date: new Date().toISOString(),
            location: data.location || "Detected Location", coords: data.coords,
            photo: data.photo, video: data.video, priority: data.priority || 'Medium',
            updates: [{ timestamp: new Date().toISOString(), message: 'Report received by district node.', by: 'District AI' }]
        };
        this.db.reports.unshift(newReport);
        this.persist();
        this.broadcastLocal('NEW_ISSUE', newReport);
        return newReport;
    }

    public async updateReport(id: number, updates: Partial<DetailedReport>, actor: string) {
        const idx = this.db.reports.findIndex(r => r.id === id);
        if (idx === -1) return null;
        this.db.reports[idx] = { ...this.db.reports[idx], ...updates };
        this.persist();
        this.broadcastLocal('ISSUE_UPDATED', this.db.reports[idx]);
        return this.db.reports[idx];
    }

    public async createSOS(user: User, video?: string) {
        const alert: SOSAlert = {
            id: Date.now(), user: { name: user.name, phone: user.phone, profilePicture: user.profilePicture },
            timestamp: new Date().toISOString(), location: { address: 'Live Feed TN', coords: user.location.coords },
            status: 'Active', recordedVideo: video
        };
        this.db.sos.unshift(alert);
        this.persist();
        this.broadcastLocal('SOS_ALERT', alert);
        return alert;
    }

    public async resolveSOS(id: number, actor: string) {
        const idx = this.db.sos.findIndex(s => s.id === id);
        if (idx !== -1) {
            this.db.sos[idx].status = 'Resolved';
            this.persist();
            this.broadcastLocal('SOS_RESOLVED', id);
        }
    }
}

export const cloudCore = new BackendCore();
