import { AuthenticationService } from './authentication.service';
import { Controller, Get, Query, Redirect, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

interface LoginCallbackQuery {
  code: string;
  state: string;
}

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Get('login_authorize')
  @Redirect('', 302)
  loginAuthorize(@Res({ passthrough: true }) response: Response) {
    const state = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(32).toString('hex');
    response.cookie('state', state, {
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
    response.clearCookie('state');
    return this.authenticationService.loginCallback(code, state, sendedState);
  }
}
