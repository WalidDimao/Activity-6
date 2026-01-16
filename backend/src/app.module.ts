import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie/movie.module';
import { ReviewModule } from './review/review.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'movie_review_db',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
      // Connection pool settings to prevent crashes
      extra: {
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
      },
      // Retry connection on failure
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    MovieModule,
    ReviewModule,
  ],
})
export class AppModule {}