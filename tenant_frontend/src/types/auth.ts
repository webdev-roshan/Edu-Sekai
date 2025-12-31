export interface User {
    id: string;
    email: string;
    is_active: boolean;
    profile: any;
    roles: string[];
}

export interface AuthResponse {
    message: string;
    user?: User;
}
