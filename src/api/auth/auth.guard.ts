import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './jwt.decorator';
import * as jwt from 'jsonwebtoken';
import { JwtHeader } from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import * as process from 'node:process';

@Injectable()
export class AuthGuard implements CanActivate {
  private supabaseBaseUrl =
    process.env.SUPABASE_URL || 'https://<your-supabase-project>.supabase.co';

  private client = jwksClient({
    jwksUri: `${this.supabaseBaseUrl}/auth/v1/keys`,
    cache: true,
    rateLimit: true,
  });

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    try {
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET, {
        algorithms: ['HS256'],
      });

      (request as any).user = decoded;
      return true;
    } catch (err) {
      console.error('Token verification failed:', err);
      throw new UnauthorizedException('Token inválido');
    }
  }

  private getKey(header: JwtHeader, callback: jwt.SigningKeyCallback) {
    if (!header.kid) {
      return callback(new Error('No "kid" found in token header'));
    }

    this.client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      callback(err, signingKey);
    });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

/*
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './jwt.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private JWKS: ReturnType<any> | null = null;
  private supabaseBaseUrl =
    process.env.SUPABASE_URL || 'https://<your-supabase-project>.supabase.co';

  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async ensureJwksLoaded(): Promise<void> {
    if (!this.JWKS) {
      const jose = await import('jose');

      this.JWKS = jose.createRemoteJWKSet(
        new URL(`${this.supabaseBaseUrl}/auth/v1/keys`),
      );
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.ensureJwksLoaded();
    // Verifica se o endpoint é público
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    // try {
    //   const payload = await this.jwtService.verifyAsync(token, {
    //     secret: process.env.JWT_SECRET,
    //   });
    //   request['user'] = payload; // você pode acessar via req.user nos handlers
    // } catch (err) {
    //   throw new UnauthorizedException('Token inválido');
    // }
    try {
      const jose = await import('jose');

      const { payload } = await jose.jwtVerify(token, this.JWKS, {
        algorithms: ['RS256'],
        issuer: `${this.supabaseBaseUrl}/auth/v1`, // opcional mas recomendado
      });

      // você pode injetar o payload no request para usar depois
      (request as any).user = payload;

      return true;
    } catch (err) {
      console.error('JWT verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

*/

/*
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './jwt.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
 */
