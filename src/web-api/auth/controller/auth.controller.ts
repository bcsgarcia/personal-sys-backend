import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

import { AuthDto } from '../dto/auth.dto';
import { AuthService } from '../service/auth.service';

@ApiHeader({
  name: 'idCompany',
  description: 'The unique identifier of the company',
  example: '4e4d8d1e-7d4b-4ec7-a0f8-8c35647bb70c',
})
@ApiTags('auth')
@Controller('web/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() authDto: AuthDto) {
    return this.authService.findByEmailAndPass(authDto);
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
}
