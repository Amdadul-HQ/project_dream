export interface IUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  profile: string;
  isVerified: boolean;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  isGoogle: boolean;
  status: "Active" | "Inactive" | "Banned";
  createdAt: string;
  updatedAt: string;
}
