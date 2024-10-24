import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Container } from '@mui/material';
import api from './axios'; // Import your custom Axios instance

function AddPlan() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rooms, setRooms] = useState([
        { roomNumber: 0, capacity: 0, seats: [{ seatNumber: 1, occupied: false }] }
    ]);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle room changes
    const handleRoomChange = (index, field, value) => {
        const updatedRooms = [...rooms];
        updatedRooms[index][field] = value;

        // If changing capacity, make sure to reduce seat count if exceeding capacity
        if (field === 'capacity' && updatedRooms[index].seats.length > value) {
            updatedRooms[index].seats = updatedRooms[index].seats.slice(0, value);
        }
        setRooms(updatedRooms);
    };

    // Function to handle adding a seat to a specific room
    const addSeatToRoom = (index) => {
        const updatedRooms = [...rooms];
        const room = updatedRooms[index];

        if (room.seats.length < room.capacity) {
            room.seats.push({ seatNumber: room.seats.length + 1, occupied: false });
            setRooms(updatedRooms);
            setErrorMessage('');
        } else {
            setErrorMessage(`Cannot add more seats. Capacity for Room ${room.roomNumber} is ${room.capacity}.`);
        }
    };

    // Function to add a new room
    const addRoom = () => {
        setRooms([
            ...rooms,
            { roomNumber: 0, capacity: 0, seats: [{ seatNumber: 1, occupied: false }] }
        ]);
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newFloorPlan = {
                name,
                description,
                rooms
            };
            console.log(newFloorPlan);
            await api.post('/admin/createFloorPlan', newFloorPlan); // Use relative URL

            // Clear the form fields after successful submission
            setName('');
            setDescription('');
            setRooms([{ roomNumber: 0, capacity: 0, seats: [{ seatNumber: 1, occupied: false }] }]);
            setErrorMessage('');

            alert('Floor plan added successfully!');
        } catch (error) {
            console.error('Error adding floor plan:', error);
            alert('Error adding floor plan. Please try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '30px' }}>
                Add New Floor Plan
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>

                    {/* Render multiple rooms */}
                    {rooms.map((room, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={6}>
                                <TextField
                                    label={`Room Number`}
                                    fullWidth
                                    type="number"
                                    value={room.roomNumber}
                                    onChange={(e) => handleRoomChange(index, 'roomNumber', Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={`Capacity`}
                                    fullWidth
                                    type="number"
                                    value={room.capacity}
                                    onChange={(e) => handleRoomChange(index, 'capacity', Number(e.target.value))}
                                />
                            </Grid>

                            {/* Display seats for the current room */}
                            {room.seats.map((seat, seatIndex) => (
                                <Grid item xs={12} key={seatIndex}>
                                    <TextField
                                        label={`Seat Number ${seat.seatNumber}`}
                                        fullWidth
                                        disabled
                                        value={`Seat ${seat.seatNumber} - Occupied: ${seat.occupied}`}
                                    />
                                </Grid>
                            ))}

                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    onClick={() => addSeatToRoom(index)}
                                >
                                    Add Another Seat to Room {room.roomNumber}
                                </Button>
                            </Grid>
                        </React.Fragment>
                    ))}

                    {/* Display error message */}
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Typography color="error">{errorMessage}</Typography>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            onClick={addRoom}
                        >
                            Add Another Room
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ backgroundColor: '#021323', color: 'white' }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default AddPlan;
