import { AuthenticationService } from './authentication.service';
import {
  Controller,
  Get,
  Query,
  Redirect,
  Res,
  Req,
  Headers,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { ConferenceService } from 'src/conference/conference.service';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

interface LoginCallbackQuery {
  code: string;
  state: string;
}

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly conferenceService: ConferenceService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('whereami')
  whereami(@Headers('webconf-user-region') userAgent: string) {
    console.log(userAgent);
    return userAgent;
  }

  @Get('login_authorize')
  @Redirect('', 302)
  loginAuthorize(
    @Res({ passthrough: true }) response: Response,
    @Query('room') room: string,
  ) {
    const state = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(32).toString('hex');
    response.cookie('state', state, {
      httpOnly: true,
      secure: true,
      signed: true,
    });
    response.cookie('roomName', room, {
      httpOnly: true,
      secure: true,
      signed: true,
    });
    return { url: this.authenticationService.loginAuthorize(state, nonce) };
  }

  @Get('login_callback')
  async loginCallback(
    @Query() query: LoginCallbackQuery,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { code, state } = query;
    const sendedState = request.signedCookies?.state;
    const roomName = request.signedCookies?.roomName;
    response.clearCookie('state');
    response.clearCookie('roomName');
    const { userinfo } = await this.authenticationService.loginCallback(
      code,
      state,
      sendedState,
    );

    const refreshToken = this.jwtService.sign({
      iss: process.env.JITSI_JITSIJWT_ISS,
      exp: moment().add(12, 'hours').unix(),
      aud: process.env.JITSI_JITSIJWT_AUD,
      sub: process.env.JITSI_JITSIJWT_SUB,
    });

    const accessToken = this.jwtService.sign({
      iss: process.env.JITSI_JITSIJWT_ISS,
      exp: moment().add(15, 'minutes').unix(),
      aud: process.env.JITSI_JITSIJWT_AUD,
      sub: process.env.JITSI_JITSIJWT_SUB,
      userinfo: this.jwtService.decode(userinfo)?.email,
    });

    console.log('access', accessToken);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
    });

    return { ...this.conferenceService.sendToken(roomName), accessToken };
  }
}
