import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';

export class GetListingsDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsString()
  priceSegment?: 'high' | 'medium' | 'low';

  @IsOptional()
  @IsNumber()
  @Min(3)
  limit?: number;
}