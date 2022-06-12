import { UserRole } from '@/user/types';

export interface AuthCognitoUser {
  id: string;
  email: string;
}

export interface IAuthedUser {
  userId: number;
  userEmail: string;
  userRole: UserRole;
  companyId?: number;
}
