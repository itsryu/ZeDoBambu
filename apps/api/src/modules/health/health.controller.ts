import { Request, Response } from 'express';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatus } from '@zedobambu/shared-types';

export class HealthController {
  public checkHealth = (_req: Request, res: Response): void => {
    ApiResponse.success(res, 'API is healthy and running!', {
      status: 'UP',
      timestamp: new Date().toISOString(),
    }, HttpStatus.OK);
  };
}