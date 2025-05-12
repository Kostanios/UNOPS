import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { DataModule } from '../data/data.module';
import { IngestionController } from './ingestion.controller';

@Module({
  imports: [DataModule],
  providers: [IngestionService],
  controllers: [IngestionController],
  exports: [IngestionService],
})
export class IngestionModule {}