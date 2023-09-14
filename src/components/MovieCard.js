import React from 'react'

const MovieCard = ({movie, selectMovie}) => {
 
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w500"

  return (
    <div className='w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block relative cursor-pointer p-2' onClick={() => {selectMovie(movie)}}>
       {movie.poster_path ? <img src={`${IMAGE_PATH}${movie.backdrop_path}`} alt="poster" className=' w-full h-auto block'/> : null}
       {/* <h5 className=' mt-2'>{movie.title}</h5> */}
    </div>
  )
}

export default MovieCard