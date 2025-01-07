import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JsonValidatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') {
      console.log('Request Headers:', req.headers);
      console.log('Request Body:', req.body);

      if (typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body);
        } catch (e) {
          console.error('Invalid JSON format:', e);
          return res.status(400).json({
            error: 'Invalid JSON format',
            details: e.message,
          });
        }
      }
    }
    next();
  }
}
