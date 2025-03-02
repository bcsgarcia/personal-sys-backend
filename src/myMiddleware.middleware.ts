import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Original URL:', req.url);
    console.log('Original Path:', req.path);
    console.log('Base URL:', req.baseUrl);
    console.log('Original originalUrl:', req.originalUrl);

    // Remove /personal do início da originalUrl se existir
    if (req.originalUrl.startsWith('/personal/')) {
      req.originalUrl = req.originalUrl.replace('/personal/', '/');
      // Também atualizamos a url para manter consistência
      req.url = req.originalUrl;
      console.log('URL after removing /personal:', req.originalUrl);
    }

    next();
  }
}
