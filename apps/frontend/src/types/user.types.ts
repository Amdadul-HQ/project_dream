// types/user.types.ts

export interface IUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  profile: string;
  isVerified: boolean;
  role: "USER" | "ADMIN";
  isGoogle: boolean;
  status: "Active" | "Inactive" | "Blocked";
  token?: string;
}

export interface ISocialMedia {
  id: string;
  userId: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  instagram?: string;
  pinterest?: string;
  linkedin?: string;
  tiktok?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserStats {
  id: string;
  userId: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalFollowers: number;
  totalFollowing: number;
  engagementRate: number;
  avgViewsPerPost: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUserWithDetails extends IUser {
  socialMedia?: ISocialMedia;
  userStats?: IUserStats;
  lastActiveAt?: string;
  createdAt?: string;
  updatedAt?: string;
}