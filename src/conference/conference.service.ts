import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProsodyService } from 'src/prosody/prosody.service';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

@Injectable()
export class ConferenceService {
  constructor(
    private readonly prosodyService: ProsodyService,
    private readonly jwtService: JwtService,
  ) {}

  async roomExists(roomName: string) {
    const exists = await this.prosodyService.roomExists(roomName);
    if (exists && exists.length > 0) {
      return { roomName };
    } else {
      throw new NotFoundException("la conférence n'existe pas");
    }
  }

  async getRoomTestAccessToken(roomName: string) {
    if (
      roomName.toLocaleLowerCase().startsWith('browserTest123') &&
      roomName.length === 30
    ) {
      const jwt = this.jwtService.sign({
        iss: process.env.JITSI_JITSIJWT_ISS,
        exp: moment().add('5', 'minutes').unix(),
        aud: process.env.JITSI_JITSIJWT_AUD,
        sub: process.env.JITSI_JITSIJWT_SUB,
        room: roomName,
      });
      return { roomName, jwt };
    }
  }

  async getRoomAccessToken(
    roomName: string,
    webconfUserRegion: string,
    accessToken: string,
  ) {
    // si la conférence est déja ouverte
    const exists = await this.prosodyService.roomExists(roomName);
    if (exists && exists.length > 0) {
      return { roomName };
    }

    // si l'utilisateur RIE ou MTE
    if (this.isInternalUser(webconfUserRegion)) {
      return this.sendToken(roomName);
    }

    // si le salon n'existe pas et l'utilisateur internet (authentication check)
    if (!accessToken) {
      throw new UnauthorizedException(
        "veuillez vous authentifier pour accéder à la webconf de l'Etat",
      );
    }

    await this.verifyToken(accessToken);

    return this.sendToken(roomName);
  }

  verifyToken(jwt: string) {
    try {
      if (jwt && this.jwtService.verify(jwt)) {
        return { jwt };
      }
    } catch (error) {
      throw new UnauthorizedException("l'accessToken est expiré");
    }
  }

  isInternalUser(webconfUserRegion: string) {
    return webconfUserRegion.toLowerCase() !== 'internet';
  }

  sendToken(roomName: string) {
    const jwt = this.jwtService.sign({
      iss: process.env.JITSI_JITSIJWT_ISS,
      exp: moment()
        .add(process.env.JITSI_JITSIJWT_EXPIRESAFTER, 'hours')
        .unix(),
      aud: process.env.JITSI_JITSIJWT_AUD,
      sub: process.env.JITSI_JITSIJWT_SUB,
      room: roomName,
    });
    return { roomName, jwt };
  }
}
