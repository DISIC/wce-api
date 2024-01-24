import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MetricDocument = HydratedDocument<WhiteListedDomains>;

@Schema()
export class WhiteListedDomains {
  @Prop()
  owner: string;

  @Prop([])
  domains: any[];
}

export const MetricSchema = SchemaFactory.createForClass(WhiteListedDomains);
