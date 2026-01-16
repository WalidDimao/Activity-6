import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Movie } from '../movie/movie.entity';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Movie]),
    MovieModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}