import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Address {
  @Prop() country: string;
  @Prop() city: string;
}

@Schema()
export class Accommodation extends Document{
  @Prop() declare id: string;
  @Prop() name: string;
  @Prop({ type: Address }) address: Address;
  @Prop() isAvailable: boolean;
  @Prop() priceForNight: number;
}

export const AccommodationSchema = SchemaFactory.createForClass(Accommodation);

