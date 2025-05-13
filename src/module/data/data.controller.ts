import { Controller, Get, Query } from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { ListingService } from './listing.service';

@Controller()
export class DataController {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly listingService: ListingService,
  ) {}

  @Get('data/accommodations')
  async getAccommodations(@Query() query: Record<string, string>) {
    const accomQuery: any = {};
    const limit = query.limit ? +query.limit : 10;

    if (query.city) {
      accomQuery['address.city'] = new RegExp(query.city, 'i');
    }

    if (query.country) {
      accomQuery['address.country'] = new RegExp(query.country, 'i');
    }

    if (query.priceMin || query.priceMax) {
      const priceRange: any = {};
      if (query.priceMin) priceRange.$gte = +query.priceMin;
      if (query.priceMax) priceRange.$lte = +query.priceMax;
      accomQuery.priceForNight = priceRange;
    }

    if (query.name) {
      accomQuery.name = new RegExp(query.name, 'i');
    }

    if (query.isAvailable) {
      accomQuery.isAvailable = query.isAvailable === 'true';
    }

    return this.accommodationService.findFiltered(accomQuery, limit);
  }

  @Get('data/listings')
  async getListings(@Query() query: Record<string, string>) {
    const listingQuery: any = {};
    const limit = query.limit ? +query.limit : 10;

    if (query.city) {
      listingQuery.city = new RegExp(query.city, 'i');
    }

    if (query.priceMin || query.priceMax) {
      const priceRange: any = {};
      if (query.priceMin) priceRange.$gte = +query.priceMin;
      if (query.priceMax) priceRange.$lte = +query.priceMax;
      listingQuery.pricePerNight = priceRange;
    }

    if (query.availability !== undefined) {
      listingQuery.availability = query.availability;
    }

    if (query.priceSegment) {
      listingQuery.priceSegment = query.priceSegment;
    }

    return this.listingService.findFiltered(listingQuery, limit);
  }
}