export interface AuthResponse {
  token: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
