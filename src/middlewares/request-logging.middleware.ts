import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log incoming HTTP requests.
 */
@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  /**
   * Logs incoming HTTP requests.
   * @param req Request - The incoming HTTP request object.
   * @param res Response - The HTTP response object.
   * @param next NextFunction - The callback function to pass control to the next middleware.
   */
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request ${req.method} ${req.originalUrl} received`);
    next();
  }
}
