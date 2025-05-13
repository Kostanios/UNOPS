import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from '../../schema/listing.schema';
import { ChunkError } from '../../type/error';

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

  async bulkSave(data: any[]): Promise<{success: number, errors: any[]}> {
    const errors: ChunkError[] = [];
    let successCount = 0;

    try {
      const chunkSize = 1000;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);

        try {
          const transformed = chunk.map(item => ({
            id: item.id,
            city: item.city,
            availability: item.availability,
            priceSegment: item.priceSegment,
            pricePerNight: item.pricePerNight,
          }));

          await this.model.insertMany(transformed);

          successCount += transformed.length;
        } catch (chunkError) {
          console.error(`Error processing chunk ${i}-${i+chunkSize}:`, chunkError);
          errors.push({
            chunk: i,
            error: chunkError
          });
        }
      }

      return { success: successCount, errors };
    } catch (error) {
      console.error('Global bulk save error:', error);
      throw error;
    }
  }
}
