import { Response } from 'express';
import { IApiResponse, HttpStatus } from '@zedobambu/shared-types';

export class ApiResponse<T = unknown> {
  private statusCode: HttpStatus;
  private message: string;
  private data?: T;
  private error?: string;
  private timestamp: string;

  constructor(statusCode: HttpStatus, message: string, data?: T, error?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  public toJSON(): IApiResponse<T> {
    const response: IApiResponse<T> = {
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp,
    };
    if (this.data !== undefined) {
      response.data = this.data;
    }
    if (this.error !== undefined) {
      response.error = this.error;
    }
    return response;
  }

  public static success<U>(res: Response, message: string, data?: U, statusCode: HttpStatus = HttpStatus.OK): Response {
    const apiResponse = new ApiResponse<U>(statusCode, message, data);
    return res.status(statusCode).json(apiResponse.toJSON());
  }

  public static error(res: Response, message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR, errorDetails?: string): Response {
    const apiResponse = new ApiResponse<null>(statusCode, message, null, errorDetails || message);
    return res.status(statusCode).json(apiResponse.toJSON());
  }

  public static created<U>(res: Response, message: string, data?: U): Response {
    return ApiResponse.success(res, message, data, HttpStatus.CREATED);
  }

  public static badRequest(res: Response, message: string = 'Bad Request', errorDetails?: string): Response {
    return ApiResponse.error(res, message, HttpStatus.BAD_REQUEST, errorDetails);
  }

  public static unauthorized(res: Response, message: string = 'Unauthorized', errorDetails?: string): Response {
    return ApiResponse.error(res, message, HttpStatus.UNAUTHORIZED, errorDetails);
  }

  public static forbidden(res: Response, message: string = 'Forbidden', errorDetails?: string): Response {
    return ApiResponse.error(res, message, HttpStatus.FORBIDDEN, errorDetails);
  }

  public static notFound(res: Response, message: string = 'Not Found', errorDetails?: string): Response {
    return ApiResponse.error(res, message, HttpStatus.NOT_FOUND, errorDetails);
  }
}