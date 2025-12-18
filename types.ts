
// FIX: Removed the self-import of 'Page' that was causing a declaration conflict.
export enum Page {
  Home = 'Home',
  Services = 'Services',
  Map = 'Map',
  Report = 'Report',
  Profile = 'Profile',
}

export type GovtView = 
  'control-room' | 'issues' | 'map' | 'cctv-grid' | 'sos' | 'profile' | 'analytics' | 'team' | 
  'communications' | 'dataflow' | 'cyber-crime' |
  // New Department Views
  'health' | 'transport' | 'sanitation' | 'water' | 'electricity' | 'housing' | 
  'safety' | 'education' | 'finance' | 'public-works' | 'administration';


export type Language = 'en' | 'hi' | 'ta' | 'ml';

export interface LocationData {
  country: string;
  state: string;
  district: string;
  coords: {
    lat: number;
    lng: number;
  };
}

export interface CityPulse {
  aqi: number;
  aqiStatus: 'Good' | 'Fair' | 'Poor';
  trafficCongestion: number;
  powerUptime: number;
  waterUptime: number;
  activeEvents: number;
  temperature: number;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  password?: string;
  profilePicture: string;
  location: LocationData;
  role: 'citizen' | 'official';
  notificationPreferences?: {
    email: boolean;
    push: boolean;
  };
  sosSecretPhrase?: string;
  isSecretWordSosEnabled?: boolean;
}

export enum ReportStatus {
    Emergency = 'Emergency', // This can be deprecated in favor of priority, but keep for citizen view
    Resolved = 'Resolved',
    UnderReview = 'Under Review'
}

export interface DetailedReport {
  id: number;
  title: string;
  status: ReportStatus;
  date: string;
  category: string;
  description: string;
  location: string;
  coords: { lat: number; lng: number; };
  photo?: string;
  video?: string;
  updates: Array<{
    timestamp: string;
    message: string;
    by: string;
  }>;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  assigned_to?: {
    role: string;
    id: string;
    name: string;
  };
  sla_deadline?: string;
}

export interface MapPoint {
  id: string;
  type: 'issue' | 'facility' | 'resolved';
  coords: { lat: number; lng: number };
  details: DetailedReport;
}


export interface Announcement {
    id: number;
    title: string;
    content: string;
    source: string;
    timestamp: string;
    status: ReportStatus;
}

export interface DonationRequest {
  id: number;
  title: string;
  patientName: string;
  story: string;
  image: string;
  goal: number;
  raised: number;
  hospital: string;
}

export interface ResolvedIssue {
    id: number;
    title: string;
    category: string;
    resolvedDate: string;
    location: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: Page;
}

export interface GovtScheme {
  title: string;
  description: string;
  eligibility: string;
  benefits: string[];
}

export interface SOSAlert {
    id: number;
    user: {
        name: string;
        phone: string;
        profilePicture: string;
    };
    timestamp: string;
    location: {
        address: string;
        coords: { lat: number; lng: number };
    };
    status: 'Active' | 'Acknowledged' | 'Resolved';
    recordedVideo?: string; // Stores the base64 data URL of the recorded video
}

export type SOSState = 'idle' | 'holding' | 'countdown' | 'activated';

export interface TeamMember {
  id: string;
  name: string;
  role: 'Officer' | 'Department Head';
  avatar: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
}

export interface Department {
  id: GovtView;
  name: string;
  status: 'Normal' | 'Warning' | 'Critical';
  open_issues: number;
  avg_response_time: string; // e.g., "2.5h"
}

export type DataflowStatus = 'Received' | 'Validating' | 'Forwarded' | 'Failed';

export interface DataflowItem {
  id: string;
  service: string;
  timestamp: string;
  user: {
    name: string;
    profilePicture: string;
  };
  status: DataflowStatus;
  payload: Record<string, any>;
  externalSystem: string;
}


// --- NEW Department Specific Types ---

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  zone?: string;
  avatar: string;
}

export interface Doctor extends StaffMember {
  specialization: string;
  hospital: string;
}

export interface PoliceOfficer extends StaffMember {
  rank: string;
  station: string;
}

export interface Teacher extends StaffMember {
    subject: string;
    school: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  beds: number;
  contact: string;
  specialties: string[];
}

export interface School {
    id: string;
    name: string;
    location: string;
    principal: string;
    students: number;
}

// --- Cyber Crime Types ---
export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type CyberCategory = 
  | 'Harassment / Abuse'
  | 'Threat to Life'
  | 'Blackmail / Sexual Extortion'
  | 'Unwanted Explicit Media'
  | 'Financial Scam / Fraud'
  | 'Cyberstalking'
  | 'Phishing'
  | 'Safe';

export interface CyberReport {
  id: string;
  timestamp: string;
  senderId: string; // The phone number/ID of the perpetrator
  contentSample: string; // The text analyzed (hashed or partial if privacy settings on)
  evidenceImage?: string; // Base64 screenshot
  category: CyberCategory;
  threatLevel: ThreatLevel;
  user: {
    name: string;
    contact: string;
    location: { lat: number; lng: number };
  };
  status: 'Active' | 'Investigating' | 'Resolved' | 'False Positive';
  assignedOfficer?: string;
  aiAnalysis?: string; // Brief reasoning from AI
}

export interface InterceptedMessage {
    sender: string;
    content: string;
    platform: 'SMS' | 'WhatsApp' | 'Instagram' | 'Email';
    timestamp: string;
    detectedCategory: CyberCategory;
    threatLevel: ThreatLevel;
}

export interface UrlScanResult {
    url: string;
    isSafe: boolean;
    riskScore: number; // 0-100
    threatType?: 'Phishing' | 'Malware' | 'Scam' | null;
    hostLocation?: string;
    analysis?: string;
}

export interface BreachResult {
    source: string; // e.g., "LinkedIn Data Leak 2021"
    date: string;
    compromisedData: string[]; // e.g., ["Email", "Password", "Phone"]
}

export interface NetworkNode {
    id: string;
    type: 'Scammer' | 'Victim' | 'Phone' | 'IP' | 'BankAcc';
    label: string;
}

export interface NetworkLink {
    source: string;
    target: string;
    type: 'Contacted' | 'Transferred' | 'Used';
}

// Map Types Update
export interface TrafficSegment {
    path: [number, number][];
    level: 'low' | 'moderate' | 'high';
}

export interface LiveBus {
    id: string;
    route: string;
    coords: { lat: number; lng: number };
    nextStop: string;
    speed: number; // km/h
}

// AI Command
export interface AIDirective {
    id: string;
    timestamp: string;
    priority: 'High' | 'Critical';
    officerId: string; // Assigned officer
    action: string; // "Proceed to Location", "Secure Perimeter"
    targetLocation: { lat: number; lng: number; address: string };
    context: string; // "Report of armed robbery"
    status: 'Pending' | 'Accepted' | 'Completed';
    routePolyline?: [number, number][]; // Simplified route
}
