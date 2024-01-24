import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MetricDocument = HydratedDocument<Feedback>;

@Schema()
export class Feedback {
  @Prop()
  ip: number;

  @Prop()
  rt: {
    qty: number;
    inv: number;
  };

  @Prop()
  isVPN: number;

  @Prop()
  com: string;

  @Prop()
  jmmc_id: any;
}

export const MetricSchema = SchemaFactory.createForClass(Feedback);
