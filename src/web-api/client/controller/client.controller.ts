import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Delete,
  BadRequestException,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { validateHeaderApi } from 'src/web-api/utils/validate-header-api';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { Request } from 'express';
import { ClientService } from '../service/client.service';
import { ClientDto } from '../dto/client.dto';

@ApiHeader({
  name: 'idCompany',
  description: 'The unique identifier of the company',
  example: '4e4d8d1e-7d4b-4ec7-a0f8-8c35647bb70c',
})
@ApiTags('client')
@Controller('web/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'Client has been successfully created.',
  })
  create(@Body() createClientDto: CreateClientDto, @Req() request: Request) {
    try {
      validateHeaderApi(request);

      createClientDto.idCompany = request.headers['idcompany'] as string;
      return this.clientService.create(createClientDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('all')
  findAll(@Req() request: Request): Promise<ClientDto[]> {
    try {
      validateHeaderApi(request);

      const idCompany = request.headers['idcompany'] as string;
      return this.clientService.findAll(idCompany);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one client by id' })
  findOne(@Param('id') id: string, @Req() request: Request) {
    try {
      validateHeaderApi(request);

      return this.clientService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update an existing client' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() request: Request,
  ) {
    try {
      validateHeaderApi(request);

      return this.clientService.update(id, updateClientDto);
    } catch (error) {
      throw error;
    }
  }
}
