import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert 
} from '@mui/material';
import api from './axios'; // Import your custom Axios instance

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await api.get('/user/mybookings'); // Use relative URL
      setBookings(response.data.bookedRooms || []); // Adjust according to the response structure
      setMessage(''); // Clear any previous messages
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setMessage('Error fetching bookings. Please try again.');
      setOpenSnackbar(true); // Open Snackbar for error message
    }
  };

  const handleCancelBooking = async (roomId, floorPlanId) => {
    try {
      await api.put(`/user/cancelBooking/${floorPlanId}/${roomId}`); // Use relative URL
      fetchMyBookings(); // Refresh the booking list after cancellation
      setSelectedBooking(null);
      setMessage('Booking canceled successfully');
      setOpenSnackbar(true); // Open Snackbar for success message
    } catch (error) {
      console.error('Error canceling booking:', error);
      setMessage('Error canceling the booking. Please try again.');
      setOpenSnackbar(true); // Open Snackbar for error message
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length > 0 ? (
        <List>
          {bookings.map((booking) => (
            <ListItem key={booking.roomId} button onClick={() => handleBookingClick(booking)}>
              <ListItemText
                primary={`Room: ${booking.roomNumber}`}
                secondary={`Floor Plan: ${booking.floorPlanName}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" align="center">
          No bookings found.
        </Typography>
      )}

      {/* Dialog for showing room details */}
      {selectedBooking && (
        <Dialog open={true} onClose={() => setSelectedBooking(null)}>
          <DialogTitle>Room Details</DialogTitle>
          <DialogContent>
            <Typography>Room Number: {selectedBooking.roomNumber}</Typography>
            <Typography>Floor Plan: {selectedBooking.floorPlanName}</Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => handleCancelBooking(selectedBooking.roomId, selectedBooking.floorPlanId)} 
              color="secondary"
            >
              Cancel Booking
            </Button>
            <Button onClick={() => setSelectedBooking(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for displaying messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={message.includes('Error') ? 'error' : 'success'} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MyBookings;
