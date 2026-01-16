import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Movie } from '../movie/movie.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, movie => movie.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' }) // Explicitly bind FK column so aggregations load correctly
  movie: Movie;

  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({ name: 'user_name' })
  userName: string;

  @Column()
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}