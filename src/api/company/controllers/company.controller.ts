import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from '../service/company.service';
import { CompanyDTO } from '../dto/company.dto';
import { validateHeaderApi } from 'src/api/utils/validate-header-api';
import { Request } from 'express';
import { CompanyMainInformationDto } from '../dto/response/company-main-information.dto';
import { CreateCompanyMainInformationDto } from '../dto/request/create-company-main-information.dto';
import { UpdateCompanyMainInformationDto } from '../dto/request/update-company-main-information.dto';
import { CreatePosturalPatternDto } from '../dto/request/create-company-postural-pattern.dto';
import { PosturalPatternDto } from '../dto/response/company-postural-pattern.dto';
import { UpdatePosturalPatternDto } from '../dto/request/update-company-postural-pattern.dto';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { GetMeetAppScreenResponseDto } from '../dto/response/get-meet-app-screen-response.dto';
import { Public } from 'src/api/auth/jwt.decorator';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiBearerAuth()
  create(@Body() companyDto: CompanyDTO) {
    return this.companyService.create(companyDto);
  }

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() companyDto: CompanyDTO) {
    return this.companyService.update(id, companyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Get('/screen/get-meet-app')
  @ApiOperation({ summary: 'Get Meet App Screen information' })
  @ApiResponse({
    status: 200,
    description: 'Successful request with Meet App Screen information',
    type: GetMeetAppScreenResponseDto,
  })
  @Public()
  async getMeetAppScreen(@Req() request: Request) {
    try {
      return await this.companyService.getMeetAppScreen(
        '7c576f1d-d78e-11ed-ba77-0242ac110002',
      );
    } catch (error) {
      throw error;
    }
  }

  // main information
  @Post('/main-information')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create new main information' })
  @ApiBody({ type: CreateCompanyMainInformationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  createMainInformation(
    @Body() companyMainInformationDto: CreateCompanyMainInformationDto,
    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);

      companyMainInformationDto.idCompany = user.clientIdCompany;

      return this.companyService.createCompanyInformation(
        companyMainInformationDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('/company-main-information/all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all main information that the company configured',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The company main information has been successfully retrieved.',
    type: [CompanyMainInformationDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  findAllCompanyMainInformation(@Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);

      return this.companyService.findAllCompanyMainInformation(
        user.clientIdCompany,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete('/main-information/:id')
  @ApiBearerAuth()
  removeMainInformationById(@Param('id') id: string) {
    try {
      return this.companyService.deleteCompanyMainInformation(id);
    } catch (error) {
      throw error;
    }
  }

  @Put('/company-main-information')
  @ApiBearerAuth()
  updateMainInformation(
    @Req() request: Request,
    @Body() updateCompanyMainInformation: UpdateCompanyMainInformationDto,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);
      updateCompanyMainInformation.idCompanyMainInformation =
        user.clientIdCompany;

      return this.companyService.updateCompanyMainInformation(
        updateCompanyMainInformation,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/postural-pattern')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create new postural pattern' })
  @ApiBody({ type: CreatePosturalPatternDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'created',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  createPosturalPattern(
    @Body() posturalPattern: CreatePosturalPatternDto,
    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);
      posturalPattern.idCompany = user.clientIdCompany;

      return this.companyService.createCompanyPosturalPattern(posturalPattern);
    } catch (error) {
      throw error;
    }
  }

  @Get('/postural-pattern/all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all postural pattern that the company configured',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The company postural pattern has been successfully retrieved.',
    type: [PosturalPatternDto],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  findAllCompanyPosturalPattern(@Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);

      return this.companyService.findAllCompanyPosturalPattern(
        user.clientIdCompany,
      );
    } catch (error) {
      throw error;
    }
  }

  @Delete('/postural-pattern/:id')
  @ApiBearerAuth()
  removePosturalPatternById(@Param('id') id: string) {
    try {
      return this.companyService.deleteCompanyPosturalPattern(id);
    } catch (error) {
      throw error;
    }
  }

  @Put('/postural-pattern')
  @ApiBearerAuth()
  updatePosturalPattern(
    @Req() request: Request,
    @Body() posturalPattern: UpdatePosturalPatternDto,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);
      return this.companyService.updateCompanyPosturalPattern(posturalPattern);
    } catch (error) {
      throw error;
    }
  }
}
