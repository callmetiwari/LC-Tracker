import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import UserArea from "./pages/UserArea";
import UpComingContest from "./pages/UpComingContest";
import AboutUs from "./About";
import ChangePassword from "./pages/ChangePassword";
import Verification from "./pages/Verification";
import NewPassword from './pages/NewPassword';
import ProtectedRoute from "./pages/ProtectedRoute";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />  
        <Route path="/login" element={<Login />} />  
        <Route path="/signup" element={<SignUp />} />

        <Route 
          path="/user/:username" 
          element={
            <ProtectedRoute>
              <UserArea />
            </ProtectedRoute>
          } 
        />
        <Route path="/contests" element={<UpComingContest/>} /> 
        <Route path="/about" element={<AboutUs/>} /> 
        <Route path="/ChangePass" element={<ChangePassword/>} />  
        <Route path="/verification" element={ <Verification />} />
        <Route path="/newpassword" element={  <NewPassword/>} />  
      </Routes>
    </Router>
  );
}

export default App;