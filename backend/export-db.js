const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./movie_review.db');

console.log('\n===== COMPLETE DATABASE EXPORT =====\n');

db.all('SELECT * FROM movies', (err, movies) => {
  console.log('--- MOVIES (' + (movies ? movies.length : 0) + ') ---');
  if (movies && movies.length > 0) {
    console.log(JSON.stringify(movies, null, 2));
  } else {
    console.log('No movies found');
  }
  
  db.all('SELECT * FROM reviews', (err, reviews) => {
    console.log('\n--- REVIEWS (' + (reviews ? reviews.length : 0) + ') ---');
    if (reviews && reviews.length > 0) {
      console.log(JSON.stringify(reviews, null, 2));
    } else {
      console.log('No reviews found');
    }
    db.close();
  });
});
