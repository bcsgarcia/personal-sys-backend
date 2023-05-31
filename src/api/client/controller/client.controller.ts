import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  BadRequestException,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { Request } from 'express';
import { ClientService } from '../service/client.service';
import { ClientDto } from '../dto/client.dto';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { FtpService } from 'src/common-services/ftp-service.service';
import { Public } from 'src/api/auth/jwt.decorator';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client has been successfully created.',
  })
  create(@Body() createClientDto: CreateClientDto, @Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);

      createClientDto.idCompany = user.clientIdCompany;

      return this.clientService.create(createClientDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('all')
  @ApiBearerAuth()
  findAll(@Req() request: Request): Promise<ClientDto[]> {
    try {
      const user = new AccessTokenModel(request['user']);

      return this.clientService.findAll(user.clientIdCompany);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one client by id' })
  findOne(@Param('id') id: string, @Req() request: Request) {
    try {
      return this.clientService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    await this.clientService.uploadPhoto(file, user.clientId);
    return { message: 'File uploaded successfully' };
  }

  @ApiOperation({ summary: 'Update an existing client' })
  @Put(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    try {
      return this.clientService.update(id, updateClientDto);
    } catch (error) {
      throw error;
    }
  }
}
