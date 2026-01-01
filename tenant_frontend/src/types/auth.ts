import { AnyProfile } from "./Profile";

export interface User {
    id: string;
    is_active: boolean;
    profile: AnyProfile;
    roles: string[];
    active_role: string | null;
}

export interface AuthResponse {
    message: string;
    user?: User;
}
