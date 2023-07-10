import { Controller, Get, HttpStatus, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { IntroductionPageService } from '../service/introduction-page.service';
import { Public } from 'src/api/auth/jwt.decorator';

@ApiTags('management')
@Controller('management')
export class IntroductionPageController {
  constructor(
    private readonly introductionPageService: IntroductionPageService,
  ) {}

  @Get('/introduction-page')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all main information that the company configured',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  getCompanyInformation(@Req() request: Request) {
    try {
      const user = new AccessTokenModel(request['user']);
      // const idCompany = '7c576f1d-d78e-11ed-ba77-0242ac110002';
      return this.introductionPageService.getCompanyInformation(
        user.clientIdCompany,
      );
    } catch (error) {
      throw error;
    }
  }
}
