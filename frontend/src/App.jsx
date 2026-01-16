import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

const API_URL = "http://localhost:3000";

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    releaseYear: "",
    genre: "",
    director: "",
    durationHours: "",
    durationMinutes: ""
  });

  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 0,
    comment: ""
  });

  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchMovies = async () => {
    try {
      console.log("Fetching movies from:", `${API_URL}/movies`);
      const response = await axios.get(`${API_URL}/movies`);
      console.log("Movies loaded:", response.data);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error message:", error.message);
      alert(`Failed to load movies: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    try {
      const [movieRes, reviewsRes] = await Promise.all([
        axios.get(`${API_URL}/movies/${movieId}`),
        axios.get(`${API_URL}/reviews/movie/${movieId}`)
      ]);

      setSelectedMovie(movieRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error("Error fetching movie details:", error?.response?.data || error.message);
      alert(`Failed to load movie details: ${error?.response?.data?.message || error.message}`);
    }
  };

  const handleSelectMovie = (movieId) => {
    fetchMovieDetails(movieId);
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();

    // Calculate total minutes from hours and minutes
    const hours = newMovie.durationHours ? Number(newMovie.durationHours) : 0;
    const minutes = newMovie.durationMinutes ? Number(newMovie.durationMinutes) : 0;
    const totalMinutes = (hours * 60) + minutes;

    const payload = {
      title: newMovie.title.trim(),
      description: newMovie.description.trim() || undefined,
      releaseYear: newMovie.releaseYear ? Number(newMovie.releaseYear) : undefined,
      genre: newMovie.genre.trim() || undefined,
      director: newMovie.director.trim() || undefined,
      durationMinutes: totalMinutes > 0 ? totalMinutes : undefined,
    };

    if (!payload.title) {
      alert('Title is required');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/movies`, payload);
      setNewMovie({
        title: "",
        description: "",
        releaseYear: "",
        genre: "",
        director: "",
        durationHours: "",
        durationMinutes: ""
      });
      setShowMovieForm(false);
      fetchMovies();
      alert("Movie added successfully!");
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    if (!newReview.userName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (newReview.rating === 0) {
      alert("Please select a rating");
      return;
    }

    const payload = {
      userName: newReview.userName.trim(),
      rating: newReview.rating,
      comment: newReview.comment.trim() || undefined,
      movieId: selectedMovie.id
    };

    try {
      const response = await axios.post(`${API_URL}/reviews`, payload);
      setNewReview({ userName: "", rating: 0, comment: "" });
      setShowReviewForm(false);
      fetchMovieDetails(selectedMovie.id);
      alert("Review added successfully!");
    } catch (error) {
      alert(`Error adding review: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await axios.delete(`${API_URL}/movies/${movieId}`);
        if (selectedMovie?.id === movieId) {
          setSelectedMovie(null);
          setReviews([]);
        }
        fetchMovies();
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`${API_URL}/reviews/${reviewId}`);
        if (selectedMovie) fetchMovieDetails(selectedMovie.id);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const StarRating = ({ rating, onRate, interactive = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""} ${interactive ? "interactive" : ""}`}
            onClick={() => interactive && onRate(star)}
            style={{ cursor: interactive ? "pointer" : "default" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="container">
      <header>
        <h1>Activity 06: Movie Reviews</h1>
        <p className="subtitle">Rate and review your favorite movies</p>
      </header>

      <div className="main-content">
        <div className="movies-section">
          <div className="section-title">
            <h2>Movies</h2>
            <button className="add-movie-btn" onClick={() => setShowMovieForm(true)}>
              + Add Movie
            </button>
          </div>

          <div className="movies-grid">
            {movies.length === 0 ? (
              <div className="no-data">
                <p>No movies found. Please add your first movie.</p>
              </div>
            ) : (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className={`movie-card ${selectedMovie?.id === movie.id ? "selected" : ""}`}
                  onClick={() => handleSelectMovie(movie.id)}
                >
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-meta">
                    {movie.releaseYear && <span>{movie.releaseYear} • </span>}
                    {movie.genre && <span>{movie.genre}</span>}
                  </div>
                  <div className="rating-display">
                    <StarRating rating={Math.round(movie.averageRating || 0)} />
                    <span className="rating-value">{(movie.averageRating || 0).toFixed(1)}</span>
                    <span className="review-count">({movie.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="movie-actions">
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMovie(movie.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="movie-details-section">
          {!selectedMovie ? (
            <div className="no-data">
              <p>Select a movie to view details and reviews</p>
            </div>
          ) : (
            <>
              <div className="section-title movie-header">
                <h2>{selectedMovie.title}</h2>
                <div className="movie-rating">
                  <StarRating rating={Math.round(selectedMovie.averageRating || 0)} />
                  <span className="average-rating">
                    {(selectedMovie.averageRating || 0).toFixed(1)} ({selectedMovie.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="movie-info">
                <div className="detail-grid">
                  {selectedMovie.releaseYear && (
                    <div className="detail-item">
                      <span className="detail-label">Year:</span>
                      <span>{selectedMovie.releaseYear}</span>
                    </div>
                  )}
                  {selectedMovie.genre && (
                    <div className="detail-item">
                      <span className="detail-label">Genre:</span>
                      <span>{selectedMovie.genre}</span>
                    </div>
                  )}
                  {selectedMovie.director && (
                    <div className="detail-item">
                      <span className="detail-label">Director:</span>
                      <span>{selectedMovie.director}</span>
                    </div>
                  )}
                  {selectedMovie.durationMinutes && (
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span>{selectedMovie.durationMinutes} min</span>
                    </div>
                  )}
                </div>

                {selectedMovie.description && (
                  <div className="movie-description">
                    <h4>Description</h4>
                    <p>{selectedMovie.description}</p>
                  </div>
                )}

                <div className="reviews-section">
                  <div className="reviews-header">
                    <h3>Reviews</h3>
                    <button className="add-review-btn" onClick={() => setShowReviewForm(true)}>
                      + Add Review
                    </button>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="review-item-card">
                          <div className="review-header">
                            <div>
                              <span className="reviewer-name">{review.userName}</span>
                              <span className="review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="review-rating">
                              <StarRating rating={review.rating} />
                            </div>
                          </div>
                          {review.comment && <p className="review-comment">{review.comment}</p>}
                          <div className="review-actions">
                            <button className="delete-review-btn" onClick={() => handleDeleteReview(review.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showMovieForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Movie</h2>
              <button className="close-btn" onClick={() => setShowMovieForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddMovie}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newMovie.description}
                  onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Release Year</label>
                  <input
                    type="number"
                    value={newMovie.releaseYear}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/[eE+\-]/.test(val.slice(-1)) || val === '') {
                        setNewMovie({ ...newMovie, releaseYear: val });
                      }
                    }}
                    onKeyPress={(e) => {
                      if (/[eE+\-]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Director</label>
                  <input
                    type="text"
                    value={newMovie.director}
                    onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        placeholder="Hours"
                        min="0"
                        value={newMovie.durationHours}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!/[eE+\-]/.test(val.slice(-1)) || val === '') {
                            setNewMovie({ ...newMovie, durationHours: val });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (/[eE+\-]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>Hours</small>
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        placeholder="Minutes"
                        min="0"
                        max="59"
                        value={newMovie.durationMinutes}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || (Number(val) >= 0 && Number(val) <= 59)) {
                            if (!/[eE+\-]/.test(val.slice(-1)) || val === '') {
                              setNewMovie({ ...newMovie, durationMinutes: val });
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (/[eE+\-]/.test(e.key)) {
                            e.preventDefault();
                            return;
                          }
                          // Handle arrow up/down to wrap around 0-59
                          if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const current = newMovie.durationMinutes === '' ? 59 : Number(newMovie.durationMinutes);
                            const next = current >= 59 ? 0 : current + 1;
                            setNewMovie({ ...newMovie, durationMinutes: String(next) });
                          } else if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const current = newMovie.durationMinutes === '' ? 0 : Number(newMovie.durationMinutes);
                            const next = current <= 0 ? 59 : current - 1;
                            setNewMovie({ ...newMovie, durationMinutes: String(next) });
                          }
                        }}
                      />
                      <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>Minutes (0-59)</small>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className="submit-btn">Add Movie</button>
            </form>
          </div>
        </div>
      )}

      {showReviewForm && selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Review for {selectedMovie.title}</h2>
              <button className="close-btn" onClick={() => setShowReviewForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating *</label>
                <StarRating
                  rating={newReview.rating}
                  onRate={(rating) => setNewReview({ ...newReview, rating })}
                  interactive
                />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </div>
              <button type="submit" className="submit-btn">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
