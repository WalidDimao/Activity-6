import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Movie } from '../movie/movie.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async findAllByMovie(movieId: number): Promise<Review[]> {
    try {
      return await this.reviewRepository.find({
        where: { movieId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('[ReviewService] Error in findAllByMovie:', error);
      throw error;
    }
  }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      // Check if movie exists
      const movie = await this.movieRepository.findOne({
        where: { id: createReviewDto.movieId },
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${createReviewDto.movieId} not found`);
      }

      const review = this.reviewRepository.create(createReviewDto);
      return await this.reviewRepository.save(review);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('[ReviewService] Error in create:', error);
      throw error;
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.reviewRepository.findOne({ where: { id } });
      
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      Object.assign(review, updateReviewDto);
      return await this.reviewRepository.save(review);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('[ReviewService] Error in update:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.reviewRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
    } catch (error) {
      console.error('[ReviewService] Error in remove:', error);
      throw error;
    }
  }
}