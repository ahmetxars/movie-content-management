export type UserRole =
  'USER' |
  'ADMIN';

export interface ManagedUser {
  id: number;
  email: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
}
