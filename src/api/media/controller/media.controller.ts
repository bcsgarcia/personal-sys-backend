import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MediaService } from '../service/media.service';
import { MediaDto } from '../dto/create-media.dto';
import { UpdateMediaDto } from '../dto/update-media.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
