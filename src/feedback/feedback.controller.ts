import { FeedbackDTO } from './DTOs/feedback.dto';
import { FeedbackService } from './feedback.service';
import {
  Body,
  Controller,
  Post,
  Req,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
@Controller('feedback')
export class FeedbackController {
  constructor(
    private feedbackService: FeedbackService,
    private configService: ConfigService,
  ) {}

  @Post()
  @ApiOkResponse({ description: '' })
  @ApiBadRequestResponse({ description: 'le serveur jmmc ne repond pas' })
  @ApiBadRequestResponse({
    description: 'vous ne pouvez pas déposer deux avis pour la meme session',
  })
  @ApiNotFoundResponse({
    description:
      "une erreur s'est produite pendant la recherche de l'identifiant et le nom de la conférence",
  })
  @ApiBody({ type: FeedbackDTO })
  createFeedback(
    @Req() req: Request,
    @Body() body: FeedbackDTO,
    @Headers('webconf-user-region') fromInternetHeader: string,
  ) {
    let jmmc_id;
    const ip = req.ip;
    const isFromInternet =
      fromInternetHeader &&
      fromInternetHeader.toString().toLocaleLowerCase() == 'internet';
    if (req.signedCookies['jmmc_objectId']) {
      jmmc_id = req.signedCookies['jmmc_objectId'];
    }
    if (
      (body.isVPN == -1 && isFromInternet) ||
      ((body.isVPN == 0 || body.isVPN == 1) && !isFromInternet)
    ) {
      return this.feedbackService.createFeedback(body, jmmc_id, ip);
    } else {
      throw new BadRequestException(
        'veuillez vérifier les informations que vous avez envoyé',
      );
    }
  }
}
