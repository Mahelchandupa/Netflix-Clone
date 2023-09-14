import { BrowserRouter as Router, Routes,Route, Navigate } from "react-router-dom";
import Home from './components/Home'
import Register from "./components/Register";
import Logins from "./components/Logins";
import UserProfile from "./components/UserProfile";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const {currentUser} = useContext(AuthContext)

  const RequireAuth = ({children}) => {
     return currentUser !== null ? (children) : <Navigate to="/login"/>
  }

  return (
    <div className="App">
      <Router>
       <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="login" element={<Logins/>} />
          <Route path="register" element={<Register/>} />
          <Route path="profile" element={<RequireAuth><UserProfile /></RequireAuth>}/>
       </Routes>
      </Router>
   </div>
  );
}

export default App;
