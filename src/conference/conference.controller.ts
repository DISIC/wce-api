import { ByEmailDTO } from './DTOs/byEmail.dto';
import { roomNameDTO } from './DTOs/conference.dto';
import { ConferenceService } from './conference.service';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';

@Controller('')
export class ConferenceController {
  constructor(private readonly conferenceService: ConferenceService) {}

  @Get('/roomExists/:roomName')
  roomExists(@Param() params: roomNameDTO) {
    return this.conferenceService.roomExists(params.roomName);
  }

  @Get('/:roomName')
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
  async getRoomAccessTokenByEmail(
    @Body() body: ByEmailDTO,
    @Headers('host') host: string,
  ) {
    const args = { room: body.roomName, email: body.email, host };
    return this.conferenceService.getRoomAccessTokenByEmail(args);
  }
}
