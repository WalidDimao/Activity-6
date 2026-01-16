// In src/movie/dto/create-movie.dto.ts
import { IsString, IsOptional, IsInt, Min, Max, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty() // Add this
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1888)
  @IsOptional()
  releaseYear?: number;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  director?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  durationMinutes?: number;

  @IsUrl()
  @IsOptional()
  posterUrl?: string;
}