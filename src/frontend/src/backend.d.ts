import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ResearchRequest {
    id: RequestId;
    status: RequestStatus;
    hospitalId: HospitalId;
    studyId: StudyId;
}
export type RoundNumber = bigint;
export type HospitalId = bigint;
export type StudyId = bigint;
export interface ModelResult {
    id: ModelResultId;
    participatingHospitals: Array<HospitalId>;
    roundsCompleted: RoundNumber;
    studyId: StudyId;
    accuracy: bigint;
}
export type PatientId = Principal;
export type ConsentId = bigint;
export type ModelResultId = bigint;
export interface FederatedJob {
    id: FederatedJobId;
    status: JobStatus;
    participatingNodes: Array<HospitalId>;
    studyId: StudyId;
    roundNumber: RoundNumber;
    progressPct: bigint;
}
export type FederatedJobId = bigint;
export interface PatientConsent {
    id: ConsentId;
    requestId: RequestId;
    patientId: PatientId;
    approved: boolean;
}
export interface Hospital {
    id: HospitalId;
    name: string;
    specialization: string;
    adminId: Principal;
}
export interface Study {
    id: StudyId;
    status: StudyStatus;
    title: string;
    description: string;
    researcherId: Principal;
}
export type RequestId = bigint;
export interface UserProfile {
    name: string;
    role: string;
}
export enum JobStatus {
    pending = "pending",
    complete = "complete",
    training = "training"
}
export enum RequestStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum StudyStatus {
    active = "active",
    complete = "complete",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveConsent(consentId: ConsentId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFederatedJob(studyId: StudyId, participatingNodes: Array<HospitalId>): Promise<FederatedJobId>;
    createModelResult(studyId: StudyId, accuracy: bigint, roundsCompleted: RoundNumber, participatingHospitals: Array<HospitalId>): Promise<ModelResultId>;
    createResearchRequest(studyId: StudyId, hospitalId: HospitalId): Promise<RequestId>;
    createStudy(title: string, description: string): Promise<StudyId>;
    deleteFederatedJob(jobId: FederatedJobId): Promise<void>;
    deleteHospital(hospitalId: HospitalId): Promise<void>;
    deleteModelResult(resultId: ModelResultId): Promise<void>;
    deletePatientConsent(consentId: ConsentId): Promise<void>;
    deleteResearchRequest(requestId: RequestId): Promise<void>;
    deleteStudy(studyId: StudyId): Promise<void>;
    getAllFederatedJobs(): Promise<Array<FederatedJob>>;
    getAllHospitals(): Promise<Array<Hospital>>;
    getAllModelResults(): Promise<Array<ModelResult>>;
    getAllPatientConsents(): Promise<Array<PatientConsent>>;
    getAllResearchRequests(): Promise<Array<ResearchRequest>>;
    getAllStudies(): Promise<Array<Study>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFederatedJob(jobId: FederatedJobId): Promise<FederatedJob | null>;
    getHospital(hospitalId: HospitalId): Promise<Hospital | null>;
    getHospitalDashboard(): Promise<{
        hospital?: Hospital;
        jobs: Array<FederatedJob>;
        requests: Array<ResearchRequest>;
    }>;
    getModelResult(resultId: ModelResultId): Promise<ModelResult | null>;
    getPatientConsent(consentId: ConsentId): Promise<PatientConsent | null>;
    getPatientDashboard(): Promise<{
        patientConsents: Array<PatientConsent>;
        associatedRequests: Array<ResearchRequest>;
    }>;
    getResearchRequest(requestId: RequestId): Promise<ResearchRequest | null>;
    getResearcherDashboard(): Promise<{
        jobs: Array<FederatedJob>;
        requests: Array<ResearchRequest>;
        studies: Array<Study>;
        models: Array<ModelResult>;
    }>;
    getStudy(studyId: StudyId): Promise<Study | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerHospital(name: string, specialization: string): Promise<HospitalId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitConsent(requestId: RequestId): Promise<ConsentId>;
    updateFederatedJob(jobId: FederatedJobId, status: JobStatus, roundNumber: RoundNumber, progressPct: bigint): Promise<void>;
    updateHospital(hospitalId: HospitalId, name: string, specialization: string): Promise<void>;
    updateModelResult(resultId: ModelResultId, accuracy: bigint, roundsCompleted: RoundNumber): Promise<void>;
    updateResearchRequest(requestId: RequestId, status: RequestStatus): Promise<void>;
    updateStudy(studyId: StudyId, title: string, description: string, status: StudyStatus): Promise<void>;
}
