import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MediaService } from '../service/media.service';
import { MediaDto } from '../dto/create-media.dto';
import { AccessTokenModel } from 'src/models/access-token-user.model';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() createMediaDto: MediaDto, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    createMediaDto.idCompany = user.clientIdCompany;

    return this.mediaService.create(createMediaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Meet App Screen information' })
  @ApiResponse({
    status: 200,
    description: 'Successful request with Meet App Screen information',
    type: MediaDto,
  })
  findAll(@Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    return this.mediaService.findAll(user.clientIdCompany);
  }

  @Get('/pagined')
  @ApiOperation({ summary: 'Get Meet App Screen information' })
  @ApiResponse({
    status: 200,
    description: 'Successful request with Meet App Screen information',
    type: MediaDto,
  })
  findAllPagined(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('mediaType') mediaType: string,
    @Query('title') title: string,
  ) {
    const user = new AccessTokenModel(request['user']);

    return this.mediaService.findAllPagined(user.clientIdCompany, page, itemsPerPage, mediaType, title);
  }

  @Get('/photos')
  @ApiOperation({ summary: 'Get Meet App Screen information' })
  @ApiResponse({
    status: 200,
    description: 'Successful request with Meet App Screen information',
    type: MediaDto,
  })
  findAllPhotos(@Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    return this.mediaService.findAllPhotos(user.clientIdCompany);
  }

  @Get('/videos')
  @ApiOperation({ summary: 'Get Meet App Screen information' })
  @ApiResponse({
    status: 200,
    description: 'Successful request with Meet App Screen information',
    type: MediaDto,
  })
  findAllVideos(@Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    return this.mediaService.findAllVideos(user.clientIdCompany);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMedia: MediaDto, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    return this.mediaService.update(updateMedia);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = new AccessTokenModel(request['user']);

    return this.mediaService.remove(id);
  }
}
