import React,{useState} from 'react'

const Header = () => {

  const [searchkey, setSearchKey] = useState("")

  const serachMovies = (e) =>{
    e.preventDefault()
  }

  return (
    <div className=' container mx-auto flex items-start justify-between py-6 mb-5'>
        <h1 className=' font-mono text-2xl'>MOVIE CLONE</h1>
        <form className='' onSubmit={serachMovies}>
            <input type="text" onChange={ (e) => setSearchKey(e.target.value)} className=' text-black'/>
            <button type="submit">Search</button>
        </form>
    </div>
  )
}

export default Header