import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`original url ${req.baseUrl}`);
    console.log(`original path ${req.path}`);
    // Remove /personal do início do path se existir
    if (req.path.startsWith('/personal')) {
      req.url = req.url.replace('/personal', '');
      console.log(`/personal removed to url:${req.url} `);
    }
    next();
  }
}
