import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);