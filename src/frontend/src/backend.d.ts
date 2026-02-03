import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Inquiry {
    id: bigint;
    subject: string;
    company?: string;
    message: string;
    timestamp: Time;
    senderName: string;
    senderEmail: string;
}
export interface FeatureBox {
    title: string;
    description: string;
    targetRoute: string;
    buttonLabel: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bootstrapAdmin(): Promise<void>;
    createInquiry(senderName: string, senderEmail: string, subject: string, message: string, company: string | null): Promise<void>;
    deleteFeatureBox(id: bigint): Promise<void>;
    deleteInquiry(id: bigint): Promise<void>;
    filterInquiriesBySubject(subject: string): Promise<Array<Inquiry>>;
    getAllFeatureBoxes(): Promise<Array<FeatureBox>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantAdminRole(user: Principal): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAdmins(): Promise<Array<Principal>>;
    revokeAdminRole(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFeatureBox(id: bigint | null, box: FeatureBox): Promise<bigint>;
}
