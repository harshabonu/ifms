import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import AddPlan from './AddPlan'
import ModifyPlan from './ModifyPlan'
import DeletePlan from './DeletePlan'
import BookRoom from './BookRoom';
import MyBookings from './MyBookings'
import './App.css'
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-plan" element={<AddPlan />} />
        <Route path="/modify-plan" element={<ModifyPlan />} />
        <Route path="/delete-plan" element={<DeletePlan />} />
        <Route path="/book-room" element={<BookRoom />} />
        <Route path="/my-bookings" element={<MyBookings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
