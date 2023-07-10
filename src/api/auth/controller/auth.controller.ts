import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthDto } from '../dto/request/auth.dto';
import { AuthService } from '../service/auth.service';
import { AppAuthDto } from '../dto/request/app-auth.dto';
import { Public } from '../jwt.decorator';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { Request } from 'express';
import { AccessTokenDto } from '../dto/response/access-token-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() authDto: AuthDto) {
    return this.authService.findByEmailAndPass(authDto);
  }

  @Public()
  @Post('/app')
  appLogin(@Body() authDto: AppAuthDto) {
    return this.authService.appAuth(authDto);
  }

  @Public()
  @Post('/app/refresh')
  refreshToken(@Body() token: string) {
    return this.authService.refreshToken(token['token']);
  }

  @Public()
  @Post('/admin')
  adminLogin(@Body() authDto: AppAuthDto) {
    return this.authService.adminAuth(authDto);
  }

  @Public()
  @Post('/admin/refresh')
  refreshTokenAdmin(@Body() authDto: AppAuthDto) {
    return this.authService.adminAuth(authDto);
  }

  @Get()
  findAll() {
    return this.authService.emailAlreadyExists(
      'bcsgarcia@outlook.com',
      '0aa1e44e-cf3d-11ed-a314-0242ac110002',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: AuthDto) {
    updateAuthDto.id = id;
    return this.authService.update(updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Post('/app/change-pass')
  changePass(@Body() body: string, @Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);
      const oldPass = body['oldpass'];
      const newPass = body['newpass'];

      return this.authService.updatePassByIdClient(
        user.clientId,
        oldPass,
        newPass,
      );
    } catch (error) {
      throw error;
    }
  }
}
