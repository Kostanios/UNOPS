import { Controller, Get, Query } from '@nestjs/common';
import { AccommodationService } from './accommodation.service';
import { ListingService } from './listing.service';


@Controller()
export class DataController {
  constructor(
    private readonly accommodationService: AccommodationService,
    private readonly listingService: ListingService,
  ) {}

  @Get('data')
  async getFiltered(@Query() query: Record<string, string>) {
    const accomQuery: any = {};
    const listingQuery: any = {};

    if (query.city) {
      accomQuery['address.city'] = new RegExp(query.city, 'i');
      listingQuery.city = new RegExp(query.city, 'i');
    }

    if (query.country) {
      accomQuery['address.country'] = new RegExp(query.country, 'i');
    }

    if (query.priceMin || query.priceMax) {
      const priceRange: any = {};
      if (query.priceMin) priceRange.$gte = +query.priceMin;
      if (query.priceMax) priceRange.$lte = +query.priceMax;
      accomQuery.priceForNight = priceRange;
      listingQuery.pricePerNight = priceRange;
    }

    if (query.name) {
      accomQuery.name = new RegExp(query.name, 'i');
    }

    if (query.isAvailable) {
      accomQuery.isAvailable = query.isAvailable === 'true';
    }


    if (query.availability) {
      listingQuery.availability = query.availability === 'true';
    }

    if (query.priceSegment) {
      listingQuery.priceSegment = query.priceSegment;
    }

    const [accommodations, listings] = await Promise.all([
      this.accommodationService.findFiltered(accomQuery),
      this.listingService.findFiltered(listingQuery),
    ]);

    return [...accommodations, ...listings];
  }
}