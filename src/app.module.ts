import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConferenceModule } from './conference/conference.module';
import { StatsModule } from './stats/stats.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from './feedback/feedback.module';
import { ProsodyModule } from './prosody/prosody.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        pool: process.env.EMAIL_SMTP_POOL,
        host: process.env.EMAIL_SMTP_HOST,
        port: process.env.EMAIL_SMTP_PORT,
        secure: process.env.EMAIL_SMTP_SECURE === 'true',
        // ignoneTLS: true,
        auth: {
          user: process.env.EMAIL_SMTP_AUTH_USER,
          pass: process.env.EMAIL_SMTP_AUTH_PASS,
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized:
            process.env.EMAIL_SMTP_TLS_REJECTUNAUTHORIZED === 'true',
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JITSI_JITSIJWT_SECRET,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    AuthenticationModule,
    ConferenceModule,
    StatsModule,
    FeedbackModule,
    ProsodyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
