import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UrlRewriteMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    console.log('Original URL:', req.url);
    console.log('Original Path:', req.path);
    console.log('Base URL:', req.baseUrl);

    // Remove /personal apenas se for o primeiro segmento da URL
    if (req.url.startsWith('/personal/')) {
      req.url = req.url.replace('/personal/', '/');
      console.log('URL after removing /personal:', req.url);
    }

    next();
  }
}
