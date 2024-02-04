import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req, Put } from '@nestjs/common';
import { ClientEvaluationService } from '../service/client-evaluation.service';
import { CreateClientEvaluationDto } from '../dto/create-client-evaluation.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { CreateClientEvaluationPhotoDto } from '../dto/create-client-evaluation-photo.dto';
import { ClientEvaluationPhotoDto } from '../dto/client-evaluation-photo.dto';
import { ClientEvaluationDto } from '../dto/client-evaluation.dto';

@ApiTags('client-evaluation')
@Controller('client-evaluation')
export class ClientEvaluationController {
  constructor(private readonly clientEvaluationService: ClientEvaluationService) {}

  @Post()
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'create new client-evaluation' })
  @ApiBody({ type: CreateClientEvaluationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  create(@Body() createClientEvaluationDto: CreateClientEvaluationDto, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    createClientEvaluationDto.idCompany = user.clientIdCompany;

    return this.clientEvaluationService.create(createClientEvaluationDto);
  }

  @Get(':idClient')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all client-evaluation' })
  // @ApiBody({ type: CreateClientEvaluationDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  findAll(@Param('idClient') idClient: string, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);
    return this.clientEvaluationService.findAll(idClient, user.clientIdCompany);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.clientEvaluationService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'create new client-evaluation' })
  @ApiBody({ type: ClientEvaluationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async update(@Param('id') id: string, @Body() clientEvaluationDto: ClientEvaluationDto, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    clientEvaluationDto.idCompany = user.clientIdCompany;

    await this.clientEvaluationService.update(clientEvaluationDto);
    return { status: 'success' };
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.clientEvaluationService.remove(+id);
  }

  @Post(':id/photo')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'add photo client-evaluation' })
  @ApiBody({ type: CreateClientEvaluationPhotoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  addPhoto(
    @Param('id') clientEvaluationId: string,
    @Body() clientEvaluationPhotoDto: CreateClientEvaluationPhotoDto,
    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);

      clientEvaluationPhotoDto.idCompany = user.clientIdCompany;
      clientEvaluationPhotoDto.idClientEvaluation = clientEvaluationId;

      return this.clientEvaluationService.addPhotoClientEvaluation(clientEvaluationPhotoDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id/photo/:idPhoto')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'add photo client-evaluation' })
  @ApiBody({ type: CreateClientEvaluationPhotoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  deletePhoto(
    @Param('id') clientEvaluationId: string,
    @Param('idPhoto') clientEvaluationPhotoId: string,

    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);

      const clientEvaluationPhotoDto = new ClientEvaluationPhotoDto({
        idCompany: user.clientIdCompany,
        idClientEvaluation: clientEvaluationId,
        idClientEvaluationPhoto: clientEvaluationPhotoId,
      });

      return this.clientEvaluationService.deletePhotoClientEvaluation(clientEvaluationPhotoDto);
    } catch (error) {
      throw error;
    }
  }
}
