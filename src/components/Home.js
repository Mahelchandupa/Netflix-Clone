import { useState, useEffect, useContext } from "react";
import axios from "axios";

import requestMovies from "../request";

import MovieCard from "./MovieCard";
import {BiSolidRightArrow} from 'react-icons/bi'
import {MdOutlineClose} from 'react-icons/md'
import {BiSearch} from 'react-icons/bi'
import { BsPlusCircle } from 'react-icons/bs'
import { FaShare } from 'react-icons/fa'
import {BsCheckCircleFill} from 'react-icons/bs'

import { Link } from 'react-router-dom'
import Logo from '../assest/logo.png'
import Avatar from '../assest/Netflix-avatar.png'
import DownArrow from '../assest/down-icon.png'
import { AuthContext } from "../context/AuthContext";

import { getDatabase, ref, set } from "firebase/database";
import { db } from "../firebase";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";

import MyList from '../components/MyList'
import { list } from "firebase/storage";
import ReactPlayer from "react-player";


const Home = () => {


    const {currentUser} = useContext(AuthContext)
 
    const mylist = MyList()


    const API_URL = "https://api.themoviedb.org/3"
  
    const MOVIE_API_KEY = 'e9be79a7ba8fc8a1454cd280c988d0df'
  
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original"
  
    const [movies, setMovies] = useState([]);
    const [searchkey, setSearchKey] = useState("")
    const [heroRandomMovie,setheroRandomMovie] = useState({})

    // movie lists
    const [nowPlayingMovie,setnowPlayingMovie] = useState([])
    const [popularMovie,setPopularMovie] = useState([])
    const [topRatedMovie,setTopRatedMovie] = useState([])
    const [upComingMovie,setUpComingMovie] = useState([])

    
    const [selectedMovie, setSelectedMovie] = useState({})
    const [checkBtnTrailer, setcheckBtnTrailer] = useState(false)


    const [addtoList, setAddtoList] = useState(false)

    const [getAllmyList, setGetAllmyList] = useState([])

    const [barvisivle,setBarVisible] = useState(false)
  
    const fetchMovies = async (searchkey) =>{
  
    const type = searchkey ? 'search' : 'discover'
  
    const {data: {results}} = await axios.get(`${API_URL}/${type}/movie`,{
        params: {
          api_key: MOVIE_API_KEY,
          query: searchkey
        }
      })
  
      setheroRandomMovie(results[0])
      setMovies(results)
    }
  
  
    const fetchMovie = async (movie) =>{
  
      const {data} = await axios.get(`${API_URL}/movie/${movie.id}?api_key=${MOVIE_API_KEY}&append_to_response=videos`,{
        // params: {
        //    api_key: MOVIE_API_KEY,
        //    append_to_respons: 'videos',
        // }
      })
  
      console.log(data)
      setSelectedMovie(data)
      if(checkBtnTrailer){
        setcheckBtnTrailer(false) 
      } 
  
    }
  
    // const selectMoive = (movie) =>{
    //   console.log(movie)
    //   const data = fetchMovie(movie.id)
    //   setSelectedMovie(data)
    //   if(checkBtnTrailer){
    //     setcheckBtnTrailer(false) 
    //   } 
    // }
  
  
    const nowPlaying = async () =>{
      const {data: {results}} = await axios.get(requestMovies.requestNowPlaying)
  
      setnowPlayingMovie(results)
    }

    const upComing = async () =>{
      const {data: {results}} = await axios.get(requestMovies.requestUpComing)
  
      setUpComingMovie(results)
    }

    const topRated = async () =>{
      const {data: {results}} = await axios.get(requestMovies.requestTopRated)
  
      setTopRatedMovie(results)
    }

    const popular = async () =>{
      const {data: {results}} = await axios.get(requestMovies.requestPopular)
  
      setPopularMovie(results)
    }
  
    useEffect(() =>{
      fetchMovies()
      nowPlaying()
      upComing()
      popular()
      topRated()
    },[])
  
  
    const serachMovies = (e) =>{
      e.preventDefault()
      fetchMovies(searchkey)
  
      setSearchKey("")
    }
  
  
    const heroPlayerClick = () =>{
      setcheckBtnTrailer(true)
      fetchMovie(heroRandomMovie)
    }
  
  
    useEffect(() => {
      if(!checkBtnTrailer){
        const interval = setInterval(() => {
          const randomMovie = movies[(Math.floor(Math.random() * movies.length))]
          setheroRandomMovie(randomMovie)
          }, 9000);
  
          return () => clearInterval(interval);
      }
  
    },[checkBtnTrailer, movies]);
  
  
    const closeTrailer = () =>{
      if(checkBtnTrailer){
        setcheckBtnTrailer(false)
      }
      setSelectedMovie({})
      setAddtoList(false)
    }
  
    
    const renderTrailer= () =>{
      const trailer = selectedMovie.videos.results.find(vid => vid.name === "Official Trailer" || vid.name === "Teaser Trailer") || 'trailer not found'
      
      return(
        trailer !== 'trailer not found'? 
          <ReactPlayer
  
          url={`https://www.youtube.com/watch?v=${trailer.key}`}
          width="100%"
          height="400px"
          />
        : <p className=" text-center text-2xl my-2 text-red-600">Trailer Not found</p>
        
      )
    }


    // Find all the movies in the users myList
    useEffect(() => {
      if(currentUser !== null){
        return onSnapshot(
          collection(db, 'users', currentUser.uid, 'myList'),
          (snapshot) => setGetAllmyList(snapshot.docs)
        )
      }
    },[db, getAllmyList.id])

    //Check if the movie is already in the users myList
    useEffect(
      () =>{
       const res = getAllmyList.findIndex((result) => result.data().id === selectedMovie.id) !== -1
       setAddtoList(res)
      }
    )


    const handleFavourite = async () => {
      if(addtoList){
        await deleteDoc(
          doc(db,'users',currentUser.uid,'myList',selectedMovie.id.toString())
        )

        toast(`${selectedMovie.title} has been removed from My List`,{
          duration: 8000,

        })
      }
      else{    
        await setDoc(
          doc(db,'users',currentUser.uid,'myList',selectedMovie.id.toString()),{...selectedMovie}
        )

        toast(`${selectedMovie.title} has been added to My List`,{
          duration: 8000,

        })

        setAddtoList(true)
      }
    }

  return (
    <div className=" w-full h-[90vh] bg-custom-background">

    {/* nav */}
    <div className=' lg:container lg:mx-auto flex items-center justify-between py-6 mb-5 px-4'>
      <div className=''>
        <img src={Logo} className=" w-[130px] lg:w-[150px]"/>
      </div>
     
      <div className=" flex gap-x-5">      
        <form className={`${barvisivle ? 'w-[400px]' : ' w-[42px]'} relative h-[42px] transition-all duration-500 ease-in-out`} onSubmit={serachMovies}>
          <input type="text" onChange={ (e) => setSearchKey(e.target.value)} value={searchkey} placeholder="Type Something ........." className=' w-full h-full placeholder:text-[#7e7e7e] font-sans text-gray-300 h-full px-[15px] bg-transparent border-[1px] border-[#8c8c8c] outline-0 rounded-full'/>
          <button type="submit" className={`${barvisivle ? 'block' : 'hidden'} absolute top-[2px] right-[4px] w-[37px] h-[37px] bg-[#db0001] text-white border-[#8c8c8c] rounded-full pl-2`}>
            <BiSearch className="text-2xl cursor-pointer"/>
          </button>
          {/* search bar visible btn */}
          <button onClick={ () => setBarVisible(true)} className={`${barvisivle ? 'hidden' : ''} absolute top-[2px] right-[2px] w-[38px] h-[38px] bg-[#db0001] text-white border-[#8c8c8c] rounded-full pl-2 cursor-pointer`}>
            <BiSearch className="text-2xl"/>
          </button>
           {/* search bar visible hidden btn */}
           <MdOutlineClose onClick={ () => setBarVisible(false)}  className={` ${barvisivle ? 'block' : 'hidden'} absolute cursor-pointer -left-12 top-1 text-4xl text-[#8c8c8c]`}/>
        </form>
        {/* <BiSearch  className="text-3xl cursor-pointer my-auto"/> */}
        <button className=" border-none outline-0 bg-[#db0001] text-white text-[14px] rounded-[4px] cursor-pointer inline-flex items-center border-[1px] border-white py-[7px] px-[10px]">English<img className=" w-[10px] ml-[10px]" src={DownArrow}/></button>
        {
          currentUser !== null ? <Link to="/profile"><img src={Avatar} className="w-[40px] object-cover rounded-[4px]" alt=""/></Link>  
           : <Link to="/login" className=" border-none outline-0 bg-[#db0001] text-white text-[14px] rounded-[4px] ml-[10px] cursor-pointer py-[9px] px-[10px]">Sign In</Link>      
        }  
      </div>
    </div>

    <Toaster position="bottom-center"/>

    <div className=" mx-4 lg:container lg:mx-auto mb-10">
      <div className=" rounded-md w-full min-h-[450px] bg-cover lg:min-h-[550px] mt-5 mb-8 flex items-center" style={{backgroundImage: `url('${IMAGE_PATH}${heroRandomMovie?.backdrop_path || heroRandomMovie?.poster_path}')`, backgroundRepeat: 'no-repeat' }}>        
        <div className="hero-content mx-3 lg:mx-10">  
            <h1 className=" my-4 text-5xl lg:text-7xl">{heroRandomMovie.title}</h1>
            {heroRandomMovie.overview ? <p className=" w-[full] lg:w-[700px] text-md  lg:text-lg">{heroRandomMovie.overview}</p> : null}
            <button onClick={heroPlayerClick} className="banner-btn mt-4 lg:mt-2 bg-white text-black">
              <BiSolidRightArrow  className=" h-4 w-4 text-black md:h-7 md:w-7"/>
              Play
            </button>
        </div>
      </div>

      {/* video player */}
      <div className={`${ selectedMovie !== null && Object.keys(selectedMovie).length > 0 ? ' block' : 'hidden'} fixed flex flex-col items-center w-[95%] lg:w-[700px] min-h-[500px] bg-[#141417] pb-4  justify-center z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition duration-200 ease-in-out`}>
        {selectedMovie.videos ? renderTrailer() : null} 
        <div className="my-2">
          <p className=" text-sm text-slate-400 px-5 py-4">{selectedMovie.overview}</p>
          <div className=" flex gap-6 px-5">
           <button onClick={handleFavourite} className=" text-[#8c8c8c]">
            {
              addtoList ? (
                <BsCheckCircleFill className=" text-xl text-[#8c8c8c]"/>
                ):(
                <BsPlusCircle className=" text-xl text-[#8c8c8c]"/>
              )
            }
           </button>
           <button className=" text-[#8c8c8c]"><FaShare className=" text-xl text-[#8c8c8c]"/></button>
          </div>
        </div>
        <button className={`bg-red-600 text-white py-2 px-4 absolute z-50 right-0 top-0`} onClick={closeTrailer}>X</button>
      </div>


      {/* relative w-full grid grid-flow-col h-auto overflow-x-scroll scrollbar-hide scroll-smooth */}
    
      <h3 className="my-8 text-white text-2xl">Up Coming</h3>
      <div className=" relative flex items-center">
        <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
          {
            upComingMovie.map((movie) => (
              <MovieCard key={movie.id} movie={movie} selectMovie={fetchMovie}/>
            ))
          }
        </div>
      </div>


      <h3 className="my-8 text-white text-2xl">Popular</h3>
      <div className=" relative flex items-center">
        <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
          {
            popularMovie.map((movie) => (
              <MovieCard key={movie.id} movie={movie} selectMovie={fetchMovie}/>
            ))
          }
        </div>
      </div>


      <h3 className="my-8 text-white text-2xl">Top Rated</h3>
      <div className=" relative flex items-center">
        <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
          {
            topRatedMovie.map((movie) => (
              <MovieCard key={movie.id} movie={movie} selectMovie={fetchMovie}/>
            ))
          }
        </div>
      </div>
      
      
      <h3 className="my-8 text-white text-2xl">Now Playing</h3>
      <div className=" relative flex items-center">
        <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
          {
            nowPlayingMovie.map((movie) => (
              <MovieCard key={movie.id} movie={movie} selectMovie={fetchMovie}/>
            ))
          }
        </div>
      </div>
       
    {
      mylist.length > 0 && (
      <div>
        <h3 className="my-8 text-white text-2xl">My List</h3>
        <div className=" relative fle items-center">
            <div className=" w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
              {
                mylist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} selectMovie={fetchMovie} />
              ))
              }
            </div>
        </div>
      </div>
      )
    }

    
    <h3 className="my-8 text-white text-2xl">Discover</h3>
    <div className=" relative flex items-center">
      <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
          {
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} selectMovie={fetchMovie}/>
            ))
          }
      </div>
    </div>

   </div>
  </div>
  )
}

export default Home