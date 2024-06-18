import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { PartnershipService } from '../service/partnership.service';
import { CreatePartnershipDto } from '../dto/create-partnership.dto';
import { UpdatePartnershipDto } from '../dto/update-partnership.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('partnership')
@Controller('partnership')
export class PartnershipController {
  constructor(private readonly partnershipService: PartnershipService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new partner',
  })
  @ApiResponse({
    status: 200,
    description: 'Create new partner',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, unable to retrieve notifications.',
  })
  create(@Body() createPartnerDto: CreatePartnershipDto, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    createPartnerDto.idCompany = user.clientIdCompany;

    return this.partnershipService.create(createPartnerDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update existing partner',
  })
  @ApiResponse({
    status: 200,
    description: 'Update existing partner',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, unable to retrieve notifications.',
  })
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnershipDto, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    updatePartnerDto.idCompany = user.clientIdCompany;
    updatePartnerDto.id = id;

    return this.partnershipService.update(updatePartnerDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all partners',
    description: "This endpoint retrieves an array of partners to be displayed on the mobile app's partnership screen.",
  })
  @ApiResponse({
    status: 200,
    description: 'An array of partners successfully retrieved.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, unable to retrieve partners.',
  })
  findAll(@Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    // return this.partnersService.findAll(user.clientIdCompany);
    return this.partnershipService.findAll(user.clientIdCompany);
  }

  @Post('/logo-image/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Upload partner logo image',
    description: "This endpoint uploads a partner's logo image to the server.",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('id') idPartnership: string) {
    try {
      if (!this.partnershipService.validateFile(file)) {
        return { status: 'error', message: 'Invalid file type' };
      }

      console.log(file);
      await this.partnershipService.uploadPartnershipLogo(file, idPartnership);
      console.log('success');
      return { status: 'success' };
    } catch (e) {
      console.error('Upload failed', e);
      return { status: 'error' };
    }
  }

  @Get('category')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all partnership category',
    description: 'This endpoint retrieves an array of partnership category.',
  })
  @ApiResponse({
    status: 200,
    description: 'An array of partnership category successfully retrieved.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, unable to retrieve partnership category.',
  })
  findAllCategory(@Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    return this.partnershipService.findAllCategory(user.clientIdCompany);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete partner',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete partner',
  })
  @ApiBadRequestResponse({
    description: 'Bad request, unable to delete partner.',
  })
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);
    return this.partnershipService.remove(id, user.clientIdCompany);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return ''; //this.partnersService.findOne(+id);
  }
}
