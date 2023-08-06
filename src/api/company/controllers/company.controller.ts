import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from '../service/company.service';
import { CompanyDTO } from '../dto/company.dto';
import { Request } from 'express';
import { CompanyMainInformationDto } from '../dto/response/company-main-information.dto';
import { CreateCompanyMainInformationDto } from '../dto/request/create-company-main-information.dto';
import { CreatePosturalPatternDto } from '../dto/request/create-company-postural-pattern.dto';
import { PosturalPatternDto } from '../dto/response/company-postural-pattern.dto';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { GetMeetAppScreenResponseDto } from '../dto/response/get-meet-app-screen-response.dto';
import { Public } from 'src/api/auth/jwt.decorator';
import { UpdateMainInformationListDto } from '../dto/request/update-main-information-list.dto';
import { DeleteItemDto } from '../dto/request/delete-item.dto';
import { UpdatePosturalPatternListDto } from '../dto/request/update-postural-pattern-list.dto';

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

  @Put()
  @ApiBearerAuth()
  update(@Body() companyDto: CompanyDTO, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    companyDto.id = user.clientIdCompany;
    return this.companyService.update(companyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Get('/screen/get-meet-app/:id')
  @ApiOperation({ summary: 'Get Meet App Screen information' })
  @ApiResponse({
    status: 200,
    description: 'Successful request with Meet App Screen information',
    type: GetMeetAppScreenResponseDto,
  })
  @Public()
  async getMeetAppScreen(@Param('id') id: string) {
    try {
      return await this.companyService.getMeetAppScreen(id);
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

  @Post('/delete-company-main-information')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete main information' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  removeMainInformationById(
    @Req() request: Request,
    @Body() deleteItemDto: DeleteItemDto,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);
      deleteItemDto.idCompany = user.clientIdCompany;

      return this.companyService.deleteCompanyMainInformation(deleteItemDto);
    } catch (error) {
      throw error;
    }
  }

  @Put('/company-main-information')
  @ApiBearerAuth()
  updateMainInformation(
    @Req() request: Request,
    @Body() updateCompanyMainInformation: UpdateMainInformationListDto,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);
      updateCompanyMainInformation.idCompany = user.clientIdCompany;

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

  @Post('/delete-postural-pattern')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete postural pattern' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  removePosturalPatternById(
    @Req() request: Request,
    @Body() deleteItemDto: DeleteItemDto,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);
      deleteItemDto.idCompany = user.clientIdCompany;

      return this.companyService.deleteCompanyPosturalPattern(deleteItemDto);
    } catch (error) {
      throw error;
    }
  }

  @Put('/postural-pattern')
  @ApiBearerAuth()
  updatePosturalPattern(
    @Req() request: Request,
    @Body() posturalPatternList: UpdatePosturalPatternListDto,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);
      posturalPatternList.idCompany = user.clientIdCompany;
      return this.companyService.updateCompanyPosturalPattern(
        posturalPatternList,
      );
    } catch (error) {
      throw error;
    }
  }
}
