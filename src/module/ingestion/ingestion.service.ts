import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as StreamArray from 'stream-json/streamers/StreamArray';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { DataType } from '../../enum/data.enum';
import { AccommodationService } from '../data/accommodation.service';
import { ListingService } from '../data/listing.service';
import { Accommodation } from '../../schema/accommodation.schema';
import { Listing } from '../../schema/listing.schema';

@Injectable()
export class IngestionService {
  private readonly BATCH_SIZE = 1000;

  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly listingService: ListingService
) {}

  async ingestFromUrl(url: string, sourceType: DataType) {
    const response = await axios.get(url, { responseType: 'stream' });
    const jsonStream = StreamArray.withParser();

    let batch: (Accommodation | Listing)[] = [];

    const processing = async () => {
      for await (const { value } of jsonStream) {
        batch.push(value);

        if (batch.length >= this.BATCH_SIZE) {
          await this.processBatch(batch, sourceType);
          batch = [];
        }
      }

      if (batch.length > 0) {
        await this.processBatch(batch, sourceType);
      }
    };

    await Promise.all([
      pipeline(response.data as Readable, jsonStream),
      processing(),
    ]);
  }

  private async processBatch(batch: any[], sourceType: DataType) {
    try {
      if (sourceType === DataType.Accommodation) {
        await this.accommodationService.bulkSave(batch);
      } else if (sourceType === DataType.Listing) {
        await this.listingService.bulkSave(batch);
      }
    } catch (error) {
      console.error('Batch processing error:', error);
    }
  }
}
