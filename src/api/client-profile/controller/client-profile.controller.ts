import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Delete,
} from '@nestjs/common';
import { ClientProfileService } from '../service/client-profile.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { CreateGoalsDto } from '../dto/create-goals.dto';
import { DeleteGoalsDto } from '../dto/delete-goals.dto';

@Controller('client-profile')
export class ClientProfileController {
  constructor(private readonly clientProfileService: ClientProfileService) {}

  @Post(':idClient/goals')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create goals by client' })
  @ApiResponse({
    status: 201,
    description: 'Goal created.',
  })
  addClientGoals(
    @Param('idClient') idClient: string,
    @Body() goalDto: CreateGoalsDto,
    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);

      goalDto.idClient = idClient;
      goalDto.idCompany = user.clientIdCompany;

      return this.clientProfileService.addClientGoals(goalDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':idClient/goals')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete goals by client' })
  @ApiResponse({
    status: 200,
    description: 'Goal Deleted.',
  })
  deleteClientGoals(
    @Param('idClient') idClient: string,
    @Body() goalDto: DeleteGoalsDto,
    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);

      goalDto.idClient = idClient;
      goalDto.idCompany = user.clientIdCompany;

      return this.clientProfileService.deleteClientGoals(goalDto);
    } catch (error) {
      throw error;
    }
  }

  @Get(':idClient')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get client-profile screen by client' })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  findAll(
    @Param('idClient') idClient: string,
    @Req() request: Request,
  ): Promise<any> {
    try {
      const user = new AccessTokenModel(request['user']);
      return this.clientProfileService.getProfileScreenInfo(
        idClient,
        user.clientIdCompany,
      );
    } catch (error) {
      throw error;
    }
  }
}
