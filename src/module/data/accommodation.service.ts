import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Accommodation } from '../../schema/accommodation.schema';
import { Model } from 'mongoose';


@Injectable()
export class AccommodationService {
  constructor(@InjectModel(Accommodation.name) private model: Model<Accommodation>) {}

  async save(item: Accommodation) {
    const transformed = {
      id: item.id,
      name: item.name,
      country: item.address?.country,
      city: item.address?.city,
      isAvailable: item.isAvailable,
      priceForNight: item.priceForNight,
    };
    return this.model.create(transformed);
  }

  async findFiltered(query: any) {
    return this.model.find(query).exec();
  }
}