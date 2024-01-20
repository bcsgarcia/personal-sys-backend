import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Req } from '@nestjs/common';
import { ClientEvaluationService } from '../service/client-evaluation.service';
import { CreateClientEvaluationDto } from '../dto/create-client-evaluation.dto';
import { UpdateClientEvaluationDto } from '../dto/update-client-evaluation.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenModel } from 'src/models/access-token-user.model';

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

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateClientEvaluationDto: UpdateClientEvaluationDto) {
    return this.clientEvaluationService.update(+id, updateClientEvaluationDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.clientEvaluationService.remove(+id);
  }
}
