import { ProsodyModule } from './../prosody/prosody.module';
import { Module } from '@nestjs/common';
import { ConferenceController } from './conference.controller';
import { ConferenceService } from './conference.service';

@Module({
  imports: [ProsodyModule],
  controllers: [ConferenceController],
  providers: [ConferenceService],
  exports: [ConferenceService],
})
export class ConferenceModule {}
