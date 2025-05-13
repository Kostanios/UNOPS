import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Listing extends Document {
  @Prop() declare id: string;
  @Prop() city: string;
  @Prop() availability: boolean;
  @Prop() priceSegment: 'high' | 'medium' | 'low';
  @Prop() pricePerNight: number;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
