import { Controller, Get } from '@nestjs/common';
import { Public } from './api/auth/jwt.decorator';

@Controller('/health')
export class AppController {
  @Public()
  @Get()
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
