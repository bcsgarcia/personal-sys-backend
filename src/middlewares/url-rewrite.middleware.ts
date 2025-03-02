import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UrlRewriteMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    // Remove /personal do início do path se existir
    if (req.path.startsWith('/personal')) {
      req.url = req.url.replace('/personal', '');
      console.log(`/personal removed from url:${req.url} `);
    }
    next();
  }
}
