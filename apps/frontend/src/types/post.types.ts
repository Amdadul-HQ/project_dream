// types/series.types.ts

export interface TSeries {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  postsCount: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TSeriesResponse {
  success: boolean;
  message: string;
  data: TSeries[];
}

export interface TCreateSeriesInput {
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}