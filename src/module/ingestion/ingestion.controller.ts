import { Controller, Post, Query } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { DataType } from '../../enum/data.enum';

@Controller('ingest')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  async runIngestion(@Query('type') type: DataType) {
    const urls = {
      accommodation: 'https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/structured_generated_data.json',
      listing: 'https://buenro-tech-assessment-materials.s3.eu-north-1.amazonaws.com/large_generated_data.json',
    };
    const url = urls[type];
    if (!url) throw new Error('Invalid type provided');

    await this.ingestionService.ingestFromUrl(url, type);
    return { message: `${type} ingested successfully` };
  }
}