import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Readable } from 'stream';
import { DataType } from '../../enum/data.enum';
import { AccommodationService } from '../data/accommodation.service';
import { ListingService } from '../data/listing.service';
import { Accommodation } from '../../schema/accommodation.schema';
import { Listing } from '../../schema/listing.schema';
import { streamDownloader } from '../../utils/stream-downloader';

@Injectable()
export class IngestionService {
  private readonly BATCH_SIZE = 1000;

  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly listingService: ListingService
) {}

  async ingestFromUrl(url: string, sourceType: DataType) {
    const response = await axios.get(url, { responseType: 'stream' });

    await streamDownloader<Accommodation | Listing>(
      response.data as Readable,
      async (batch) => {
        await this.processBatch(batch, sourceType);
      },
      this.BATCH_SIZE
    );
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
