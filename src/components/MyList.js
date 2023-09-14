import { collection, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { db } from '../firebase'

const MyList = () => {

  const {currentUser} = useContext(AuthContext)

  const [list, setList] = useState([])

  useEffect(() =>{
    if(currentUser === null) return

    return onSnapshot(
        collection(db, 'users', currentUser.uid, 'myList'),
        (snapshot) =>{
            setList(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            )
        }
    )
  },[db,currentUser.uid])

  return list

}

export default MyList