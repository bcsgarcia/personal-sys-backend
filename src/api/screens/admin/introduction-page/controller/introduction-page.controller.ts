import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { IntroductionPageService } from '../service/introduction-page.service';
import { DeleteBeforeAndAfterImageDto } from '../dto/delete-before-and-after-image.dto';
import { DeleteTestimonyDto } from '../dto/delete-testimony.dto';
import { CreateItemDto } from '../dto/create-item.dto';

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
      return this.introductionPageService.getCompanyInformation(
        user.clientIdCompany,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/before-and-after-image')
  createBeforeAndAfterImage(
    @Body() createItemDto: CreateItemDto,
    @Req() request: Request,
  ) {
    const user = new AccessTokenModel(request['user']);

    //.idCompany = user.clientIdCompany;

    return this.introductionPageService.createBeforeAndAfterImage(
      createItemDto.beforeAndAfterImageToInsert,
      user.clientIdCompany,
    );
  }

  @Delete('/before-and-after-image')
  deleteBeforeAndAfterImage(
    @Body() deleteBeforeAndAfterImageDto: DeleteBeforeAndAfterImageDto,
    @Req() request: Request,
  ) {
    const user = new AccessTokenModel(request['user']);

    deleteBeforeAndAfterImageDto.idCompany = user.clientIdCompany;

    return this.introductionPageService.deleteBeforeAndAfterImage(
      deleteBeforeAndAfterImageDto,
    );
  }

  @Post('/testimony')
  createTestimony(
    @Body() createItemDto: CreateItemDto,
    @Req() request: Request,
  ) {
    const user = new AccessTokenModel(request['user']);

    return this.introductionPageService.createTestimony(
      createItemDto.testimonyToInsert,
      user.clientIdCompany,
    );
  }

  @Delete('/testimony')
  deleteTestimony(
    @Body() deleteTestimonyDto: DeleteTestimonyDto,
    @Req() request: Request,
  ) {
    const user = new AccessTokenModel(request['user']);

    deleteTestimonyDto.idCompany = user.clientIdCompany;

    return this.introductionPageService.deleteTestimony(deleteTestimonyDto);
  }
}
