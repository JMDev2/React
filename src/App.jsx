import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import { Query } from 'appwrite';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzc5ZGZlZjk1NjYxOTJkNzBjODZhNzNiYzhlY2M5OCIsIm5iZiI6MTc1MTM0OTYxNS4xMTEsInN1YiI6IjY4NjM3OTZmMzc4NWZjZDIxYTRkMGI3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m4uSoduSUdsYbuOIvGCxT9nF05xAPPuRZdPunvjza8k'
const VITE_APP_ID = '6864a8a1003c9f6d2056'
const VITE_APPWRITE_DATABASE = '6864aa3a000e05a42466'
const VITE_APPWRITE_METRICS = '6864aa8000152d0e5f60'

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
const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
const [trendingMovies, settrendingMovies] = useState([]);


//Dobounce the search term to prevent making too many requests
//by waiting for the user to stop for 500ms
useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);


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

      // if(query && data.results.length > 0){
      //   await updateSearchCount(Query, data.results[0]);
      // }
  
      if (query && data.results.length > 0) {
    await updateSearchCount(query, data.results[0]);
}

  } catch (error) {
    setErrorMessage('Error in fetching the movies. Please try again later.')
  }finally {
    setIsLoading(false);
  }
}


//trending movies
const loadTrendingMovies = async () => {
  try {
    const movies = await getTrendingMovies();
    console.log("Trending Movies:", movies); // ✅ SEE WHAT COMES BACK
    settrendingMovies(movies);
  } catch (error) {
    console.error(`Error fetching trending movies: ${error}`);
  }
};



useEffect(() => {
  fecthMovies(debounceSearchTerm)

}, [debounceSearchTerm]);

//We've created another use effect to avaoid calling the trending movies every time
useEffect(() => {
  loadTrendingMovies();

}, []);

  return (
   <div className='pattern'>
    <div className='wrapper'>
      <header>
        <img src="./hero.png" alt="Hero Banner" />

        <h1>Find <span className='text-gradient'> Movies</span> you enjoy without a Hassle</h1>
      
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      </header>
      

 {/* trending movies render section */}
 {trendingMovies.length > 0 && (
  <section className='trending'>
    <h2>Trending Movies</h2>

    <ul>
  {trendingMovies.map((movie, index) => (
    <li key={movie.$id}>
      <p>{index + 1}. {movie.title}</p>
      <img src={movie.poster_url} alt={movie.title} />
    </li>
  ))}
</ul>
  </section>
 )}


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