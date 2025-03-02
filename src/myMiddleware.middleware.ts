import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Original URL:', req.url);
    console.log('Original Path:', req.path);
    console.log('Base URL:', req.baseUrl);

    // Remove /personal do baseUrl se existir
    if (req.baseUrl.startsWith('/personal/')) {
      const newBaseUrl = req.baseUrl.replace('/personal/', '/');
      // No Express, não podemos modificar o baseUrl diretamente
      // Então vamos reconstruir a URL completa
      req.url = newBaseUrl + (req.url === '/' ? '' : req.url);
      console.log('URL after removing /personal:', req.url);
    }

    next();
  }
}
