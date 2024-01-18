import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConferenceModule } from './conference/conference.module';

@Module({
  imports: [AuthenticationModule, ConferenceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
