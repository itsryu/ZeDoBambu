import type { Request, Response } from 'express';
import { ApiResponse } from '@/utils/apiResponse';

export const notFoundMiddleware = (_req: Request, res: Response): Response => {
  return ApiResponse.notFound(res, `Route not found: ${_req.originalUrl}`);
};