import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UrlRewriteMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // Remove /personal do início da URL se existir
    if (req.url.startsWith('/personal')) {
      req.url = req.url.replace('/personal', '');
    }
    next();
  }
}
