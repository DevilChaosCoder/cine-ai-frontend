import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import './App.css';

// FINAL, CORRECTED URL FOR YOUR LIVE BACKEND
const API_BASE_URL = "https://cine-ai-backend.onrender.com";

function App() {
  const [moviePool, setMoviePool] = useState([]);
  const [ratings, setRatings] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getNewMovies = () => {
    // Note the added /api prefix
    axios.get(`${API_BASE_URL}/api/movies`)
      .then(response => {
        setMoviePool(response.data);
        setError(''); // Clear any previous errors
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
        setError("Could not connect to the recommendation engine. The backend may be asleep, please wait and refresh.");
      });
  };

  useEffect(() => {
    getNewMovies();
  }, []);

  const handleRating = (title, rating) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [title]: rating
    }));
  };

  const getRecommendations = () => {
    if (Object.keys(ratings).length < 3) {
      setError("Please rate at least 3 movies to get a recommendation.");
      return;
    }
    setError('');
    setIsLoading(true);
    setRecommendations([]);
    // Note the added /api prefix
    axios.post(`${API_BASE_URL}/api/recommend`, { ratings })
      .then(response => {
        setRecommendations(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error getting recommendations:", error);
        setError("An error occurred while getting recommendations.");
        setIsLoading(false);
      });
  };

  const clearAll = () => {
    setRatings({});
    setRecommendations([]);
    setError('');
    getNewMovies();
  };

  return (
    <div className="App">
      <header>
        <h1>🔮 Cine Cipher</h1>
        <p>Summon spirits of the silver screen. Rate films to reveal personalized apparitions.</p>
      </header>
      
      <h3>First, channel your tastes by rating these films:</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className="movie-grid">
        {moviePool.map(movie => (
          <div key={movie.title} className="movie-tile">
            <img src={movie.Poster_Link} alt={movie.title} />
            <h4>{movie.title}</h4>
            <StarRating 
              movieTitle={movie.title}
              onRate={handleRating}
              currentRating={ratings[movie.title] || 0}
            />
          </div>
        ))}
      </div>
      
      <div className="control-panel">
        <button onClick={clearAll} className="app-button">Redo From Begin 🧹</button>
        <button onClick={getNewMovies} className="app-button">Reveal More Films 🔄</button>
        <button onClick={getRecommendations} className="app-button" disabled={isLoading}>
          {isLoading ? "Summoning..." : "Conjure My Recommendations ✨"}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-list">
          <h2>The spirits have spoken! You may enjoy these apparitions:</h2>
          {recommendations.map((movie, index) => (
            <div key={movie.title}>
              <h4>{index + 1}. {movie.title}</h4>
              <p>{movie.overview}</p>
              <hr style={{borderColor: '#333'}}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;