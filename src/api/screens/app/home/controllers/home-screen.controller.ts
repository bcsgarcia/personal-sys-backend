import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppHomeScreenService } from '../service/home-screen.service';
import { Request } from 'express';
import { AccessTokenModel } from 'src/models/access-token-user.model';

@ApiTags('AppHomeScreen')
@Controller('app/home/screen')
export class AppHomeScreenController {
  constructor(private readonly appHomeScreenService: AppHomeScreenService) {}

  @Get('')
  @ApiOperation({ summary: 'Get the home screen to app' })
  @ApiResponse({
    status: 200,
    description: 'The home screen has been successfully retrieved.',
  })
  getHomeScreen(@Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);

      return this.appHomeScreenService.getHomeScreen(user);
    } catch (error) {
      throw error;
    }
  }
}
