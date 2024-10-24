import React, { useEffect, useState } from 'react';
import {
    Button,
    Typography,
    Grid,
    Container,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert
} from '@mui/material';
import api from './axios'; // Import your custom Axios instance

function BookRoom() {
    const [floorPlans, setFloorPlans] = useState([]);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        fetchFloorPlans();
    }, []);

    const fetchFloorPlans = async () => {
        try {
            const response = await api.get('/admin/floorPlans'); // Use relative URL
            setFloorPlans(response.data.floorPlans || []);
        } catch (error) {
            console.error('Error fetching floor plans:', error);
            setMessage('Error fetching floor plans. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
    };

    const handleBookRoom = async () => {
        if (!selectedRoom || !selectedFloorPlan) return;
        try {
            const response = await api.post('/user/bookRoom', { // Use relative URL
                roomId: selectedRoom._id,
                floorPlanId: selectedFloorPlan._id
            });
            setMessage(response.data.message);
            setOpenSnackbar(true);
            fetchFloorPlans(); // Refresh the list after booking
            setSelectedRoom(null); // Clear selected room
        } catch (error) {
            console.error('Error booking room:', error);
            setMessage('Error booking room. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleFloorPlanSelect = (floorPlan) => {
        setSelectedFloorPlan(floorPlan);
        setSelectedRoom(null); // Clear previously selected room
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Book a Room
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">Select a Floor Plan</Typography>
                    <List>
                        {floorPlans.map((floorPlan) => (
                            <ListItem button key={floorPlan._id} onClick={() => handleFloorPlanSelect(floorPlan)}>
                                <ListItemText primary={floorPlan.name} secondary={floorPlan.description} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>

                {selectedFloorPlan && (
                    <Grid item xs={12}>
                        <Typography variant="h6">Select a Room</Typography>
                        <List>
                            {selectedFloorPlan.rooms.map((room) => (
                                <ListItem 
                                    button 
                                    key={room._id} 
                                    onClick={() => handleSelectRoom(room)}
                                    disabled={room.booked}
                                >
                                    <ListItemText 
                                        primary={`Room ${room.roomNumber}`} 
                                        secondary={`Capacity: ${room.capacity}`} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                )}

                {selectedRoom && (
                    <Grid item xs={12} align="center">
                        <Typography variant="h6">
                            You have selected Room {selectedRoom.roomNumber}. Do you want to book it?
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleBookRoom}>
                            Confirm Booking
                        </Button>
                    </Grid>
                )}
            </Grid>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default BookRoom;
