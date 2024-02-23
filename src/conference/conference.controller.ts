import { ConferenceService } from './conference.service';
import { Controller } from '@nestjs/common';

@Controller('')
export class ConferenceController {
  constructor(private readonly conferenceService: ConferenceService) {}

  //   @Get('/roomExists/:roomName')
  //   roomExists(@Param() params: roomNameDTO) {
  //     return this.conferenceService.roomExists(params.roomName);
  //   }
}
