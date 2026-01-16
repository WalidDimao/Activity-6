import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Review } from '../review/review.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'release_year', nullable: true })
  releaseYear: number; 

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  director: string;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes: number; 

  @Column({ name: 'poster_url', nullable: true })
  posterUrl: string;

  @OneToMany(() => Review, review => review.movie)
  reviews: Review[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}