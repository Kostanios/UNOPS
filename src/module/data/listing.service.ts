import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from '../../schema/listing.schema';


@Injectable()
export class ListingService {
  constructor(@InjectModel(Listing.name) private model: Model<Listing>) {}

  async save(item: Listing) {
    const transformed = {
      id: item.id,
      city: item.city,
      availability: item.availability,
      priceSegment: item.priceSegment,
      pricePerNight: item.pricePerNight,
    }
    return this.model.create(transformed)
  }

  async findFiltered(query: any) {
    return this.model.find(query).exec();
  }
}