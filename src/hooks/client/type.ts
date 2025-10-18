export type LoginResponse = {
    token: string;
    expires_in: number; // in hours (1 week)
    role: string;
};                                                