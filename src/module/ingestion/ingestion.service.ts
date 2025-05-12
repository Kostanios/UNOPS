import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as StreamArray from 'stream-json/streamers/StreamArray';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { DataType } from '../../enum/data.enum';
import { AccommodationService } from '../data/accommodation.service';
import { ListingService } from '../data/listing.service';

@Injectable()
export class IngestionService {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly listingService: ListingService
) {}

  async ingestFromUrl(url: string, sourceType: DataType) {
    const response = await axios.get(url, { responseType: 'stream' });

    const jsonStream = StreamArray.withParser();

    const processing = async () => {
      for await (const { value } of jsonStream) {
        if (sourceType === DataType.Accommodation) await this.accommodationService.save(value);
        else if (sourceType === DataType.Listing) await this.listingService.save(value);
      }
    };

    await Promise.all([
      pipeline(response.data as Readable, jsonStream),
      processing(),
    ]);
  }
}
