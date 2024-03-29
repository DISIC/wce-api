import { Injectable } from '@nestjs/common';
import { IsEmail, Matches } from 'class-validator';

@Injectable()
export class ByEmailDTO {
  @Matches(
    new RegExp(
      '^(?=(?:[a-zA-Z0-9]*[a-zA-Z]))(?=(?:[a-zA-Z0-9]*[0-9]){' +
        process.env.FRONTCONF_ROOMNAMECONSTRAINT_MINNUMBEROFDIGITS +
        '})[a-zA-Z0-9]{' +
        process.env.FRONTCONF_ROOMNAMECONSTRAINT_LENGTH +
        ',}$',
    ),
    { message: "le nom de conférence n'est pas valide" },
  )
  roomName: string;

  @IsEmail()
  email: string;
}
