import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Accommodation } from '../../schema/accommodation.schema';
import { Model } from 'mongoose';
import { ChunkError } from '../../type/error';

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

  async bulkSave(data: any[]): Promise<{success: number, errors: any[]}> {
    const errors: ChunkError[] = [];
    let successCount = 0;

    try {
      const chunkSize = 100;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);

        try {
          const transformed = chunk.map(item => ({
            id: item.id,
            name: item.name,
            country: item.address?.country,
            city: item.address?.city,
            isAvailable: item.isAvailable,
            priceForNight: item.priceForNight,
          }));

          await this.model.insertMany(transformed, { rawResult: true, ordered: false });

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
