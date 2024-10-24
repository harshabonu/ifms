import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

export default function Navbar() {
  // Check if the token exists in local storage
  const token = localStorage.getItem('token'); // Adjust the key as needed

  const handleLogout = () => {
    // Handle logout logic (e.g., removing token and redirecting)
    localStorage.removeItem('token');
    // You might want to redirect to the login page
    window.location.href = '/login'; // Change this as per your routing
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ height: '30%' }}>
        <Toolbar sx={{ background: "#021323", color: "white", fontWeight: 'bold' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Floor Plan Management System
          </Typography>
          <Button color="inherit" component={Link} to="/about">About Us</Button>
          <Button color="inherit" component={Link} to="/contact">Contact Us</Button>

          {/* Conditionally render buttons based on token existence */}
          {token ? (
            <>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
              <Avatar alt="User Avatar" src="/avatar.png" />
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
