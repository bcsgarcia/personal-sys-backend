import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from '../service/upload.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenModel } from 'src/models/access-token-user.model';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'upload media file' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Body('idMedia') idMedia: string,
    @Body('mediaType') mediaType: string,
  ) {
    try {
      if (!this.uploadService.validateFile(file)) {
        return { status: 'error', message: 'Invalid file type' };
      }

      console.log(file);
      await this.uploadService.uploadFile(file, mediaType, idMedia);
      console.log('success');
      return { status: 'success' };
    } catch (e) {
      console.error('Upload failed', e);
      return { status: 'error' };
    }
  }

  @Post('evaluation-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'upload media file' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async uploadEvaluationPhoto(
    @UploadedFile() file,
    @Body('idClient') idClient: string,
    @Body('idClientEvaluation') idClientEvaluation: string,
  ) {
    try {
      if (!this.uploadService.validateFile(file)) {
        return { status: 'error', message: 'Invalid file type' };
      }

      console.log(file);
      await this.uploadService.uploadClientEvaluationPhoto(
        file,
        idClient,
        idClientEvaluation,
      );
      console.log('success');
      return { status: 'success' };
    } catch (e) {
      console.error('Upload failed', e);
      return { status: 'error' };
    }
  }

  @Delete('evaluation-photo/:id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'upload media file' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async deleteEvaluationPhoto(
    @Param('id') idClientEvaluationPhoto: string,
    @Body('idClient') idClient: string,
    @Body('idClientEvaluation') idClientEvaluation: string,
    @Body('fileName') fileName: string,

    @Req() request: Request,
  ) {
    try {
      const user = new AccessTokenModel(request['user']);

      const idCompany = user.clientIdCompany;

      await this.uploadService.deleteClientEvaluationPhoto(
        fileName,
        idClient,
        idClientEvaluation,
      );
      console.log('success');
      return { status: 'success' };
    } catch (e) {
      console.error('Upload failed', e);
      return { status: 'error' };
    }
  }
}
