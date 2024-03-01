import { AuthenticationService } from './authentication.service';
import {
  Controller,
  Get,
  Query,
  Redirect,
  Res,
  Req,
  Headers,
  UnauthorizedException,
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

interface LogoutCallbackQuery {
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
    const { userinfo, idToken } =
      await this.authenticationService.loginCallback(code, state, sendedState);

    const tokenClaims = {
      iss: process.env.JITSI_JITSIJWT_ISS,
      aud: process.env.JITSI_JITSIJWT_AUD,
      sub: process.env.JITSI_JITSIJWT_SUB,
      email: this.jwtService.decode(userinfo)?.email,
      idToken,
    };

    const refreshToken = this.jwtService.sign({
      exp: moment().add(12, 'hours').unix(),
      ...tokenClaims,
    });

    const accessToken = this.jwtService.sign({
      exp: moment().add(15, 'minutes').unix(),
      ...tokenClaims,
    });

    console.log('access', accessToken);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
    });

    return { ...this.conferenceService.sendToken(roomName), accessToken };
  }

  @Get('logout')
  @Redirect('', 302)
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { idToken } = this.jwtService.decode(
      request?.signedCookies?.refreshToken,
    );
    const state = crypto.randomBytes(32).toString('hex');
    response.cookie('state', state, {
      httpOnly: true,
      secure: true,
      signed: true,
    });
    return { url: this.authenticationService.logout(state, idToken) };
  }

  @Get('logout_callback')
  @Redirect('', 302)
  logoutCallback(
    @Query() query: LogoutCallbackQuery,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sendedState = request?.signedCookies?.state;
    const { state } = query;

    if (state !== sendedState) {
      throw new UnauthorizedException(
        "le state de retour n'est pas la meme que celle qui a été envoyé",
      );
    }

    response.clearCookie('refreshToken');
    response.clearCookie('state');
    return { url: '/' };
  }

  @Get('refreshToken')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    let refreshToken = request.signedCookies?.refreshToken;
    try {
      await this.jwtService.verify(refreshToken);

      const tokenClaims = {
        iss: process.env.JITSI_JITSIJWT_ISS,
        aud: process.env.JITSI_JITSIJWT_AUD,
        sub: process.env.JITSI_JITSIJWT_SUB,
        email: this.jwtService.decode(refreshToken)?.email,
        idToken: this.jwtService.decode(refreshToken)?.idToken,
      };

      refreshToken = this.jwtService.sign({
        exp: moment().add(12, 'hours').unix(),
        ...tokenClaims,
      });

      const accessToken = this.jwtService.sign({
        exp: moment().add(15, 'minutes').unix(),
        ...tokenClaims,
      });

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        signed: true,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('veuillez vous authetifier');
    }
  }
}
