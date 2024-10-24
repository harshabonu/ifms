import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import map from './map.png';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import add from './add.jpg';
import view from './view.webp';
import del from './delete.jpg';
import seat from './seat.jpg';
import room from './room.webp';
import api from './axios'; // Import your API instance

function Home() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Assuming you have a way to get the token from local storage or context
        const token = localStorage.getItem('token');
        const response = await api.get('/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming the response contains a user object with a role property
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <div className="home-background">
      <div className="content">
        <Typography variant="h4" align="center" gutterBottom sx={{ color: "white", fontWeight: 'bold', fontSize: '3rem', marginTop: '40%' }}>
          Welcome to Intelligent Floor Plan Management System (IFMS)
        </Typography>
        <img src={map} alt="Example Image" className="home-image" style={{ marginTop: '50px' }} />
        <div className="cards-container" style={{ marginTop: '110px', marginBottom: '40px' }}>
          {/* Show all options for admin */}
          {userRole === 'admin' && (
            <>
              <Card className="card" component={Link} to="/add-plan" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                <CardMedia component="img" height="140" image={add} alt="Add Floor Plan" />
                <CardContent>
                  <Typography variant="h6" component="div">Add Floor Map</Typography>
                </CardContent>
              </Card>

              <Card className="card" component={Link} to="/modify-plan" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                <CardMedia component="img" height="140" image={view} alt="View Floor Plan" />
                <CardContent>
                  <Typography variant="h6" component="div">Modify Floor Map</Typography>
                </CardContent>
              </Card>

              <Card className="card" component={Link} to="/delete-plan" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
                <CardMedia component="img" height="140" image={del} alt="Delete Floor Plan" />
                <CardContent>
                  <Typography variant="h6" component="div">Delete Floor Map</Typography>
                </CardContent>
              </Card>
            </>
          )}

          {/* Show options for both admin and user */}
          <Card className="card" component={Link} to="/book-room" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
            <CardMedia component="img" height="140" image={room} alt="Book a Room" />
            <CardContent>
              <Typography variant="h6" component="div">Book a Room</Typography>
            </CardContent>
          </Card>

          <Card className="card" component={Link} to="/my-bookings" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>
            <CardMedia component="img" height="140" image={seat} alt="My Bookings" />
            <CardContent>
              <Typography variant="h6" component="div">My Bookings</Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
