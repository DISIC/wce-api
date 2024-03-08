import { ProsodyModule } from './../prosody/prosody.module';
import { Module } from '@nestjs/common';
import { ConferenceController } from './conference.controller';
import { ConferenceService } from './conference.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WhiteListedDomains,
  WhiteListedDomainsSchema,
} from 'src/schemas/WhiteListedDomains.schema';

@Module({
  imports: [
    ProsodyModule,
    MongooseModule.forFeature([
      {
        name: WhiteListedDomains.name,
        schema: WhiteListedDomainsSchema,
      },
    ]),
  ],
  controllers: [ConferenceController],
  providers: [ConferenceService],
  exports: [ConferenceService],
})
export class ConferenceModule {}
