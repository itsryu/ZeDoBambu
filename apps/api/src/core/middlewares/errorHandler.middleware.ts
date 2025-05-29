import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '@/utils/apiResponse';
import { HttpStatus } from '@zedobambu/shared-types';
import { Logger } from '@/utils/logger';

interface IHttpError extends Error {
  status?: number;
  statusCode?: number;
}

export const errorHandlerMiddleware = (
  err: IHttpError | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  Logger.error(err.message, 'ErrorHandler');

  if (err.stack) {
    Logger.debug(err.stack, 'ErrorHandlerStack');
  }

  if (err instanceof ZodError) {
    const errorMessages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return ApiResponse.badRequest(res, 'Validation Error', errorMessages);
  }

  const statusCode = (err as IHttpError).status || (err as IHttpError).statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(res, message, statusCode as HttpStatus, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};