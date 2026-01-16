import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async findAll(): Promise<any[]> {
    try {
      const query = this.movieRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.reviews', 'review');

      const movies = await query.getMany();

      return movies.map((movie) => {
        const averageRating = movie.reviews.length
          ? movie.reviews.reduce((sum, review) => sum + review.rating, 0) / movie.reviews.length
          : 0;

        return {
          id: movie.id,
          title: movie.title,
          description: movie.description,
          releaseYear: movie.releaseYear,
          genre: movie.genre,
          director: movie.director,
          durationMinutes: movie.durationMinutes,
          posterUrl: movie.posterUrl,
          createdAt: movie.createdAt,
          updatedAt: movie.updatedAt,
          averageRating,
          reviewCount: movie.reviews.length,
        };
      });
    } catch (error) {
      console.error('[MovieService] Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const movie = await this.movieRepository.findOne({
        where: { id },
        relations: ['reviews'],
      });

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }

      const averageRating = movie.reviews.length
        ? movie.reviews.reduce((sum, review) => sum + review.rating, 0) / movie.reviews.length
        : 0;

      return {
        ...movie,
        averageRating,
        reviewCount: movie.reviews.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('[MovieService] Error in findOne:', error);
      throw error;
    }
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const movie = this.movieRepository.create(createMovieDto);
      return await this.movieRepository.save(movie);
    } catch (error) {
      console.error('[MovieService] Error in create:', error);
      throw error;
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    try {
      const movie = await this.findOne(id);
      Object.assign(movie, updateMovieDto);
      return await this.movieRepository.save(movie);
    } catch (error) {
      console.error('[MovieService] Error in update:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.movieRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
    } catch (error) {
      console.error('[MovieService] Error in remove:', error);
      throw error;
    }
  }
}
