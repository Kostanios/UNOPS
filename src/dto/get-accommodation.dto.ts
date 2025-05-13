import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';

export class GetAccommodationsDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

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
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(3)
  limit?: number;
}