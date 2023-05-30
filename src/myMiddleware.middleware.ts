import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Middleware logic goes here

    console.log(`original url ${req.headers.origin}`);

    console.log('Middleware executed');
    next(); // Call next to pass control to the next middleware or route handler
  }
}
