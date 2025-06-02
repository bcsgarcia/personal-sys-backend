import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl, body } = req;
    const start = Date.now();
    const timestamp = this.getFormattedTimestamp();

    // console.log(`[${timestamp}] [${method}] ${originalUrl}`);
    // console.log('Request Body:', body);

    return next.handle().pipe(
      tap((responseBody) => {
        const duration = Date.now() - start;
        // console.log('Response Body:', responseBody);
        console.log(
          `[${timestamp}] [${method}] ${originalUrl} - ${resStatus(
            responseBody,
          )} (${duration}ms)`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - start;
        console.error(
          `[${timestamp}] [${method}] ${originalUrl} - 500 (${duration}ms)`,
        );
        // console.error('Mensagem do erro:', error.message);
        console.error('Stacktrace:', error.stack);
        return throwError(() => error);
      }),
    );
  }

  private getFormattedTimestamp(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(now.getDate())}/${pad(
      now.getMonth() + 1,
    )}/${now.getFullYear()} ${pad(now.getHours())}:${pad(
      now.getMinutes(),
    )}:${pad(now.getSeconds())}`;
  }
}

// Função opcional para tentar inferir status da resposta
function resStatus(response: any): number {
  if (response?.statusCode) return response.statusCode;
  return 200; // padrão se não informado
}
