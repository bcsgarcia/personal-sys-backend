import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UrlRewriteMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    next();
  }
}
