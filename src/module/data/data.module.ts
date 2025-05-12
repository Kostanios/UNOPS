import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Accommodation, AccommodationSchema } from '../../schema/accommodation.schema';
import { Listing, ListingSchema } from '../../schema/listing.schema';
import { DataController } from './data.controller';
import { AccommodationService } from './accommodation.service';
import { ListingService } from './listing.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Accommodation.name, schema: AccommodationSchema },
      { name: Listing.name, schema: ListingSchema },
    ])
  ],
  controllers: [DataController],
  providers: [AccommodationService, ListingService],
  exports: [AccommodationService, ListingService],
})
export class DataModule {}
