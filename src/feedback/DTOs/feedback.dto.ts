import { Injectable } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class Rating {
  @IsNumber({}, { message: 'inv doit etre un nombre' })
  @IsOptional()
  @Min(0, { message: 'inv doit etre supérieur à 0' })
  @Max(5, { message: 'inv doit etre inférieur à 5' })
  inv: number;
  @IsNumber({}, { message: 'qty doit etre un nombre' })
  @Min(1, { message: 'qty doit etre supérieur à 1' })
  @Max(5, { message: 'qty doit etre inférieur à 5' })
  qty: number;
}

@Injectable()
export class FeedbackDTO {
  @IsNumber({}, { message: 'isVPN doit etre un nombre' })
  @Min(-1, { message: 'isVPN doit etre supérieur à -1' })
  @Max(1, { message: 'isVPN doit etre inférieur à 1' })
  isVPN: number;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Rating)
  rt: Rating;

  @IsString({ message: 'com doit etre une chaine de caractères' })
  com: string;
}
