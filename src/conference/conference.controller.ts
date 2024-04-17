import { ByEmailDTO } from './DTOs/byEmail.dto';
import { roomNameDTO } from './DTOs/conference.dto';
import { ConferenceService } from './conference.service';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('')
export class ConferenceController {
  constructor(private readonly conferenceService: ConferenceService) {}

  @Get('/roomExists/:roomName')
  @ApiOkResponse({ description: 'retourne roomName si la conférence existe' })
  @ApiNotFoundResponse({
    description: "retourne 404 si la conférence n'existe pas",
  })
  roomExists(@Param() params: roomNameDTO) {
    return this.conferenceService.roomExists(params.roomName);
  }

  @Get('/:roomName')
  @ApiOkResponse({
    description: 'retourne roomName si la conférence est déja ouverte',
  })
  @ApiOkResponse({
    description: "retourne roomName et jwt si la conférence n'est pas ouverte",
  })
  @ApiNotFoundResponse({
    description: "retourne 404 si la conférence n'existe pas",
  })
  @ApiUnauthorizedResponse({
    description:
      "veuillez vous authentifier pour accéder à la webconf de l'Etat",
  })
  @ApiBody({ type: roomNameDTO })
  @ApiBearerAuth()
  getRoomAccessToken(
    @Param() params: roomNameDTO,
    @Headers('webconf-user-region') webconfUserRegion: string,
    @Headers('authorization') accessToken: string,
  ) {
    accessToken = accessToken && accessToken.split(' ')[1];
    return this.conferenceService.getRoomAccessToken(
      params.roomName,
      webconfUserRegion,
      accessToken,
    );
  }

  @Post('conference/create/byemail')
  @ApiOkResponse({
    description: "retourne { isWhitelisted: true, sended: 'email sended' }",
  })
  @ApiOkResponse({
    description: "retourne roomName et jwt si la conférence n'est pas ouverte",
  })
  @ApiBadRequestResponse({
    description: "erreur de l'envoi de l'email",
  })
  @ApiUnauthorizedResponse({
    description:
      "retourne { isWhitelisted: false } si l'émail n'est pas autorisé",
  })
  @ApiBody({ type: ByEmailDTO })
  async getRoomAccessTokenByEmail(
    @Body() body: ByEmailDTO,
    @Headers('host') host: string,
  ) {
    const args = { room: body.roomName, email: body.email, host };
    return this.conferenceService.getRoomAccessTokenByEmail(args);
  }
}
