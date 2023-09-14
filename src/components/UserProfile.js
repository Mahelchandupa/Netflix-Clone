import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Logo from '../assest/logo.png'
import Avatar from '../assest/Netflix-avatar.png'
import MovieCard from "./MovieCard";
import MyList from '../components/MyList'
import { doc, serverTimestamp, setDoc, getDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore"; 
import { db, storage } from '../firebase'
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { BiSearch } from 'react-icons/bi'
import { Toaster, toast } from 'react-hot-toast'

const UserProfile = () => {
   
    const {currentUser} = useContext(AuthContext)

    const {dispatch} = useContext(AuthContext)

    const [file, setFile] = useState("")
    const [name, setName] = useState("")
    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [getUrl, setGetUrl] = useState("")

    const [userdetails, setUserDetails] = useState({})

    const [updateProfilebtn, setUpdateProfileBtn] = useState(false)


    const [tabToggleState, setTabToggleState] = useState(1)

    const mylist = MyList()

    
    //get user details
    useEffect(() =>{
      const getUserDetails = async ()  =>{
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          setUserDetails(docSnap.data())
        } else {
          setUserDetails({})
          // docSnap.data() will be undefined in this case
          // console.log("No such document!");
        }
    
      }
      getUserDetails()
    },[currentUser.uid])


    useEffect( ()=>{
      const uploadFile = () =>{
        const filename = new Date().getTime() + file.name
        const storageRef = ref(storage, filename)

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          }, 
          (error) => {
            console.log(error)
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setGetUrl(downloadURL)
              setFile("")
            });
          }

            )  
          }
    
      file && uploadFile()
    },[file])


    const handleLogOut = (e) =>{
       e.preventDefault();
       dispatch({type: "LOGOUT"})
    }

    const handleUserProfile = async (e) =>{
      e.preventDefault();
      try{
         await setDoc(doc(db, "users", currentUser.uid), {
          profilePic : getUrl,
          name: name,
          country: country,
          city: city,
          address: address,
          phone: phone,
          timeStamp:serverTimestamp(),
      });
   
      }catch(err){
        console.log(err)
      }

      setName("")
      setCity("")
      setAddress("")
      setCountry("")
      setPhone("")
      setUpdateProfileBtn(false)

    }

    const toggleTab = (index) =>{
       setTabToggleState(index)
    }

    const [searchUsertxt, setSearchUserTxt] = useState('')
    const [foundUser, setFoundUser] = useState(false)
    const [searchUserData, setUserData] = useState({})

    const [friendId, setFriendId] = useState("")

    const findUser = async (e) =>{
        setFoundUser(true)
        e.preventDefault()
        const q = query(collection(db, "users"), where("name", "==", searchUsertxt));

        try {
          const querySnapshot = await getDocs(q);
      
          if (querySnapshot.empty) {
            console.log("No matching documents.");
            setUserData({})
            return;
          }
      
          // Loop through the documents to access user details
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            // You can access user details here
            console.log("User ID:", doc.id);
            console.log("User Name:", userData.name);
            // Access other user details as needed
            setFriendId(doc.id)
            setUserData(userData)
          });
        } catch (error) {
          console.error("Error searching for users:", error);
        }

        setSearchUserTxt("")
    }

    const handleAddFriend = async () => {
      try{
        const friendRef = doc(db, 'users', currentUser.uid, 'friends', friendId);

        // You don't need to provide any data in this case, so you can pass an empty object
        await setDoc(friendRef, {});
    
        // console.log('Friend ID added to the "friends" subcollection.');
        
        toast(`${searchUserData.name} added to your friend list`,{
          duration: 6000,

        })

      }catch(err){
        console.log(err)
      }
    }

    const [getFriends,setGetFriends] = useState([])


    useEffect(() => {
      const friendsCollectionRef = collection(db, 'users', currentUser.uid, 'friends');
  
      // Create a real-time listener for the friends collection
      const unsubscribe = onSnapshot(friendsCollectionRef, async (snapshot) => {
        const updatedFriends = [];
  
        await Promise.all(snapshot.docs.map(async (docSnap) => {
          const friendId = docSnap.id;
  
          // Fetch the friend's details from the "users" collection
          const friendDocRef = doc(db, 'users', friendId);
          const friendDocSnapshot = await getDoc(friendDocRef);
  
          if (friendDocSnapshot.exists()) {
            const friendData = friendDocSnapshot.data();
            const friendDetails = {
              friendId: friendId,
              name: friendData.name || 'Unknown Name',
              profilePic: friendData.profilePic || Avatar,
            };
            updatedFriends.push(friendDetails);
          }
        }));
  
        setGetFriends(updatedFriends);
      });
  
      return () => unsubscribe(); // Unsubscribe when the component unmounts
    }, [currentUser.uid]);



  return (

    <div className=' bg-[#141414] w-full min-h-screen'>
        <Link to="/" className=' absolute top-8 left-10'>
          <img src={Logo} alt='Logo' className=" w-[130px] lg:w-[150px]"/>
        </Link>
       <div className='container mx-auto pt-[120px] pb-[3px] flex items-center justify-center lg:justify-end gap-x-4 border-b-[1px] border-gray-700'>
       <button onClick={ () => toggleTab(1)} className={`${tabToggleState === 1 ? '  tab active-tab' : ' tab '} tab`}>My List</button>
        <span className=' text-[16px] text-[#8c8c8c]'>|</span> 
        <button onClick={ () => toggleTab(2)} className={` ${tabToggleState === 2 ? '  tab active-tab' : ' tab '} tab`}>Profile</button>
        <span className=' text-[16px] text-[#8c8c8c]'>|</span>        
        <button onClick={ () => toggleTab(3)} className={` ${tabToggleState === 3 ? '  tab active-tab' : ' tab '} tab`}>Friends</button>
        <span className=' text-[16px] text-[#8c8c8c]'>|</span>        
        <button onClick={handleLogOut} className={`border-none outline-0  text-[#E50914] hover:text-[#E50910] transition duration-300 ease-in-out text-[16px] cursor-pointer py-[9px] px-[10px]`}>Logout</button> 
       </div>

       {/* user profile */}
     
       <div className={`${tabToggleState === 2 ? ' hidden w-full lg:w-[1000px] lg:mx-auto bg-[#141212] mt-12 min-h-[400px] p-8 rounded-xl active-tab-container' : ' hiddenw-full lg:w-[1000px] lg:mx-auto bg-[#141212] mt-12 min-h-[400px] p-8 rounded-xl'} hidden w-full lg:w-[1000px] lg:mx-auto bg-[#141212] mt-12 min-h-[400px] p-8 rounded-xl`}>
        
       {
        
        Object.keys(userdetails).length === 0 ? (
          
          <div className={`${!updateProfilebtn ? 'block' : 'hidden' }`}>
              <h3 className=' text-center text-3xl text-[#4b4545]'>Update Your Profile</h3>
              <p className=' text-center mt-1 text-lg text-[#4b4545]'>Click the Button</p>
              <div className=' flex justify-center mt-48'>
                <button onClick={() => setUpdateProfileBtn(true)} className=' bg-blue-950 opacity-50 hover:opacity-100 transition duration-300 ease-in-out px-10 py-2 rounded-sm'>Update Profile</button>
             </div>          
          </div>                   
          ) : 

          <div className={`${!updateProfilebtn ? 'block' : 'hidden' }`}>
          <div className='flex gap-x-5 items-center mb-10'>
              <img src={userdetails.profilePic} alt='profile picture' className='w-[100px] h-[100px] object-cover'/>
              <p className=' text-gray-400'>
                {userdetails.name}
              </p>
          </div>
          <table className=' mb-10 text-gray-400 w-full mx-auto sm:w-[50%] md:w-[50%] lg:w-[50%] table-fixed border-collapse'>
            <tr className=' bg-transparent text-center border-b-[1px] border-gray-700'>
              <td className=' p-2 border-gray-700'>Country</td>
              <td className=' p-2 border-l-[1px] border-gray-700'>{userdetails.country}</td>
            </tr>
            <tr className=' bg-transparent text-center border-b-[1px] border-gray-700'>
              <td className=' p-2 border-gray-700'>City</td>
              <td className=' p-2 border-l-[1px] border-gray-700'>{userdetails.city}</td>
            </tr>
            <tr className=' bg-transparent text-center border-b-[1px] border-gray-700'>
              <td className=' p-2 border-gray-700'>Address</td>
              <td className=' p-2 border-l-[1px] border-gray-700'>{userdetails.address}</td>
            </tr>
            <tr className=' bg-transparent text-center border-b-[1px] border-gray-700'>
              <td className=' p-2 border-gray-700'>Phone</td>
              <td className=' p-2 border-l-[1px] border-gray-700'>{userdetails.phone}</td>
            </tr>
          </table>
          <div className=' flex justify-center'>
            <button onClick={() => setUpdateProfileBtn(true)} className=' bg-blue-950 opacity-50 hover:opacity-100 transition duration-300 ease-in-out px-10 py-2 rounded-sm'>Update Profile</button>
          </div>
       </div>
          
         }
                
         <form onSubmit={handleUserProfile} className={`${updateProfilebtn ? 'block' : 'hidden' } w-full lg:w-[800px] lg:mx-auto`}>
            {/* <label for="photo">Profile Pic</label> */}
            <div className='  grid lg:grid-cols-2 lg:gap-x-8 grid-cols-1'>
              <div>
                  <input onChange={ (e) => setFile(e.target.files[0])} className=' w-full text-[16px] rounded-[3px] py-2 px-4  bg-[#333333] mb-6 border-b-[1px] border-[#333333]' type='file' id='photo'/>
                  <input value={name} onChange={ (e) => setName(e.target.value)} className=' w-full text-[16px] rounded-[3px] py-2 px-4 bg-[#333333] mb-6 border-b-[1px] border-[#333333]' type='text' placeholder='Name'/>
                  <input value={country} onChange={ (e) => setCountry(e.target.value)} className=' w-full text-[16px] rounded-[3px] py-2 px-4 bg-[#333333] mb-6 border-b-[1px] border-[#333333]' type='text' placeholder='Country'/>
              </div>
              <div>
                  <input value={city} onChange={ (e) => setCity(e.target.value)} className=' w-full text-[16px] rounded-[3px] py-2 px-4 bg-[#333333] mb-6 border-b-[1px] border-[#333333]' type='text' placeholder='City'/>
                  <input value={address} onChange={ (e) => setAddress(e.target.value)} className=' w-full text-[16px] rounded-[3px] py-2 px-4 bg-[#333333] mb-6 border-b-[1px] border-[#333333]' type='text' placeholder='Address'/>
                  <input value={phone} onChange={ (e) => setPhone(e.target.value)} className=' w-full text-[16px] rounded-[3px] py-2 px-4 bg-[#333333] mb-6 border-b-[1px] border-[#333333]' type='text' placeholder='Phone'/>
              </div>
            </div>
            <button type='submit' className=' w-full text-center font-bold py-[9px] text-[#fff] bg-[#E50914] text-[16px] rounded-[3px]'>Update</button>
         </form>
       </div>

       {/* My List */}
       {
        mylist.length > 0 && (
        <div className={` ${tabToggleState === 1 ? ' hidden ml-3 lg:container lg:mx-auto pb-5 active-tab-container' : ' hidden ml-3 lg:container lg:mx-auto pb-5'} hidden ml-3 lg:container lg:mx-auto pb-5`}>
          <h3 className="my-10 text-white text-2xl">My List</h3>
          <div className=" relative flex items-center">
            <div className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide">
              {mylist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />              
              ))}
            </div>
          </div>
        </div>
       )
      }

      {/* friends */}
      <Toaster position="bottom-center"/>
      <div className={`${tabToggleState === 3 ? 'block' : 'hidden'} mx-6 my-10 flex gap-x-10 lg:container lg:mx-auto`}>
        
        {/* Your Friends */}
        <div className=' w-full flex-[20%] px-4 border-r-[1px] rounded-md border-[#303030]'>

        {/* search friends */}
        <div className=' w-full'>
           <form onSubmit={findUser} className=' relative w-full flex'>
              <input onChange={ (e) => setSearchUserTxt(e.target.value)} value={searchUsertxt} className=' w-full px-3 py-2 bg-transparent border-[1px] border-[#333] rounded-md placeholder:text-[#3c3c3c]' placeholder='Find friend .........'/>
              <button type='submit' className=' absolute right-3 text-xl top-3'><BiSearch /></button>
           </form>
          {
            foundUser && (
              Object.keys(searchUserData).length === 0 ? 
                 <p className=' mt-8 text-center text-xl text-[#3c3c3c]'>User Not Found</p>
               :
                <div onClick={handleAddFriend} className=' cursor-pointer p-4 mt-8 bg-[#292929] w-full h-26  lg:h-16 flex items-center rounded-md'>
                  <img src={searchUserData.profilePic} className=' w-[60px] h-[60px] lg:w-[40px] lg:h-[40px] rounded-full' />
                  <p className='ml-4 text-[#a8a8a8]'>{searchUserData.name}</p>
                </div>
            )
          }
        </div>

        <div className=' py-2 w-full border-t-[1px] border-[#292929] mt-8 h-[520px] overflow-y-scroll scroll-smooth scrollbar-hide'>
           {
            getFriends.map((friend, index) =>(

            <div key={index}  className=' cursor-pointer p-4 mt-2 bg-[#292929] w-full h-26 lg:h-16 flex items-center rounded-md'>
                <img src={friend.profilePic} alt='' className=' w-[50px] h-[50px] lg:w-[40px] lg:h-[40px] rounded-full' />
                <p className='ml-4 text-[#a8a8a8]'>{friend.name}</p>
            </div>

            ))
           }
            
        </div>

        </div>

        {/* Friend Share Movies */}
        <div className=' flex-[80%]'>
          Share Movies
        </div>


      </div>


    </div>
  )
}

export default UserProfile