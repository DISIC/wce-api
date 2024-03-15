import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as queryString from 'querystring';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class AuthenticationService {
  constructor(private readonly httpService: HttpService) {}

  loginAuthorize(state: string, nonce: string) {
    return `${process.env.AGENTCONNECT_URL}/api/v2/authorize?response_type=code&acr_values=eidas1&scope=${process.env.AGENTCONNECT_SCOPE}&client_id=${process.env.AGENTCONNECT_CLIENTID}&redirect_uri=${process.env.AGENTCONNECT_REDIRECT_URL}/login_callback&state=${state}&nonce=${nonce}`;
  }

  async loginCallback(code: string, state: string, sendedState: string) {
    const client_id = process.env.AGENTCONNECT_CLIENTID;
    const client_secret = process.env.AGENTCONNECT_SECRET;
    const redirect_uri =
      process.env.AGENTCONNECT_REDIRECT_URL + '/login_callback';

    if (sendedState !== state) {
      throw new UnauthorizedException(
        "le paramètre state recu n'est pas le meme envoyé",
      );
    }

    try {
      const {
        data: { access_token: accessToken, id_token: idToken },
      } = await this.httpService.axiosRef.post(
        `${process.env.AGENTCONNECT_URL}/api/v2/token`,
        queryString.stringify({
          grant_type: 'authorization_code',
          code,
          client_id,
          client_secret,
          redirect_uri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          proxy: false,
          httpsAgent: new HttpsProxyAgent(process.env.AGENTCONNECT_PROXYURL),
        },
      );

      const { data: userinfo } = await this.httpService.axiosRef.get(
        `${process.env.AGENTCONNECT_URL}/api/v2/userinfo`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          proxy: false,
          httpsAgent: new HttpsProxyAgent(process.env.AGENTCONNECT_PROXYURL),
        },
      );

      return { idToken, userinfo };
    } catch (error) {
      throw new NotFoundException(
        "erreur lors de récupération de l'access token",
      );
    }
  }

  logout(state, idToken) {
    const query = {
      id_token_hint: idToken,
      state,
      post_logout_redirect_uri:
        process.env.AGENTCONNECT_REDIRECT_URL + '/logout_callback',
    };
    const url = process.env.AGENTCONNECT_URL + '/api/v2/session/end' + '?';
    return url + queryString.stringify(query);
  }
}
