import { Injectable } from '@nestjs/common';
import * as JSONStream from 'stream-json';
import * as StreamArray from 'stream-json/streamers/StreamArray';
import axios from 'axios';
import { ListingService } from '../data/listing.service';
import { AccommodationService } from '../data/accommodation.service';
import { DataType } from '../../enum/data.enum';

@Injectable()
export class IngestionService {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly listingService: ListingService,
  ) {}

  async ingestFromUrl(url: string, sourceType: DataType) {
    const response = await axios.get(url, { responseType: 'stream' });
    const pipeline = response.data.pipe(JSONStream.parser()).pipe(StreamArray.withParser());

    for await (const { value } of pipeline) {
      if (sourceType === 'accommodation') {
        await this.accommodationService.save(value);
      } else {
        await this.listingService.save(value);
      }
    }
  }
}
