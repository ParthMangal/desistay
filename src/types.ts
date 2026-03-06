export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'guest' | 'vendor' | 'admin';
  kyc_status?: 'none' | 'pending' | 'verified' | 'rejected';
  kyc_documents?: string[];
}
