const API_URL = "https://api.themoviedb.org/3"

const MOVIE_API_KEY = 'e9be79a7ba8fc8a1454cd280c988d0df'
  
const request = {
    requestNowPlaying: `${API_URL}/movie/upcoming?api_key=${MOVIE_API_KEY}&language=en-US&page=1`,
    requestPopular: `${API_URL}/movie/popular?api_key=${MOVIE_API_KEY}&language=en-US&page=1`,
    requestTopRated: `${API_URL}/movie/top_rated?api_key=${MOVIE_API_KEY}&language=en-US&page=1`,
    requestUpComing: `${API_URL}/movie/upcoming?api_key=${MOVIE_API_KEY}&language=en-US&page=1`,
}

export default request