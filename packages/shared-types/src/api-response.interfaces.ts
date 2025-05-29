import { HttpStatus } from './http-status.enum';

export interface IApiResponse<T = unknown> {
  statusCode: HttpStatus;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface IPaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}