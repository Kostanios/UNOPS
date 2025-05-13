import { Controller, Get, Query } from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { ListingService } from './listing.service';
import { buildQuery } from '../../utils/build-query';

@Controller()
export class DataController {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly listingService: ListingService,
  ) {}

  @Get('data/accommodations')
  async getAccommodations(@Query() query: Record<string, string>) {
    const accomQuery = buildQuery(query, {
      city: 'address.city',
      country: 'address.country',
      priceMin: 'priceForNight.$gte',
      priceMax: 'priceForNight.$lte',
      name: 'name',
      isAvailable: 'isAvailable',
    });

    const limit = query.limit ? +query.limit : 10;
    return this.accommodationService.findFiltered(accomQuery, limit);
  }

  @Get('data/listings')
  async getListings(@Query() query: Record<string, string>) {
    const listingQuery = buildQuery(query, {
      city: 'city',
      priceMin: 'pricePerNight.$gte',
      priceMax: 'pricePerNight.$lte',
      availability: 'availability',
      priceSegment: 'priceSegment',
    });

    const limit = query.limit ? +query.limit : 10;
    return this.listingService.findFiltered(listingQuery, limit);
  }
}