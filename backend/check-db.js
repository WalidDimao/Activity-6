const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./movie_review.db');

console.log('===== ALL MOVIES IN DATABASE =====\n');

db.all('SELECT id, title, release_year, genre FROM movies ORDER BY id', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Total: ' + rows.length + ' movies\n');
    rows.forEach(r => {
      console.log(r.id + '. ' + r.title + ' (' + r.release_year + ') - ' + (r.genre || 'N/A'));
    });
  }
  
  console.log('\n===== REVIEWS =====\n');
  db.all('SELECT id, movie_id, user_name, rating FROM reviews ORDER BY movie_id, id', (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Total: ' + rows.length + ' reviews\n');
      rows.forEach(r => {
        console.log('Review ' + r.id + ': Movie ' + r.movie_id + ' - ' + r.user_name + ' (' + r.rating + ' stars)');
      });
    }
    db.close();
  });
});
