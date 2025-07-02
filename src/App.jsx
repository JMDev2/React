import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import MovieCard from './components/MovieCard';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzc5ZGZlZjk1NjYxOTJkNzBjODZhNzNiYzhlY2M5OCIsIm5iZiI6MTc1MTM0OTYxNS4xMTEsInN1YiI6IjY4NjM3OTZmMzc4NWZjZDIxYTRkMGI3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m4uSoduSUdsYbuOIvGCxT9nF05xAPPuRZdPunvjza8k'


const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
const [searchTerm, setSearchTerm] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [movieList, setMovieList] = useState([]);
const [isLoading, setIsLoading] = useState(false);


// fecth the movies api
const fecthMovies = async (query = '') => {
  setIsLoading(true);
  setErrorMessage('');
  try {
    const endpoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, API_OPTIONS)

    if(!response.ok){
      throw new Error('Failed to fetch Movies')
    }
      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'failed to Fetch Movies');
        setMovieList([]);
        return
      }
      setMovieList(data.results || [])
  
  } catch (error) {
    setErrorMessage('Error in fetching the movies. Please try again later.')
  }finally {
    setIsLoading(false);
  }
}

useEffect(() => {
  fecthMovies(searchTerm)

}, [searchTerm]);

  return (
   <div className='pattern'>
    <div className='wrapper'>
      <header>
        <img src="./hero.png" alt="Hero Banner" />

        <h1>Find <span className='text-gradient'> Movies</span> you enjoy without a Hassle</h1>
      
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      </header>
      
      <section className='all-movies'>
        <h2>All Movies</h2>

        {isLoading ? (
          <p className='text-white-500'>Loading...</p>
        ) : errorMessage ? (
          <p className='text-red-500'>{errorMessage}</p>
        ) : (
          <ul>
            {movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          </ul>
        )}
      </section>
    </div>
   </div>
  )
}

export default App