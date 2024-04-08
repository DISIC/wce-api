import { Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';

@Injectable()
export class LoginCallbackDTO {
  @IsString()
  state: string;
  @IsString()
  code: string;
}
