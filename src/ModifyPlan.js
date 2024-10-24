import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Grid,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import api from './axios'; // Import your custom Axios instance

function ModifyPlan() {
    const [floorPlans, setFloorPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: '', booked: false, seats: [] });

    useEffect(() => {
        fetchFloorPlans();
    }, []);

    const fetchFloorPlans = async () => {
        try {
            const response = await api.get('/admin/floorPlans'); // Use relative URL with your custom Axios instance
            setFloorPlans(response.data.floorPlans || []);
        } catch (error) {
            console.error('Error fetching floor plans:', error);
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setName(plan.name);
        setDescription(plan.description);
        setRooms(plan.rooms || []);
    };

    const handleUpdatePlan = async () => {
        try {
            const updatedPlan = { name, description, rooms };
            await api.put(`/admin/updateFloorPlan/${selectedPlan._id}`, updatedPlan); // Use relative URL with your custom Axios instance
            alert('Floor plan updated successfully!');
            fetchFloorPlans();
            clearForm();
        } catch (error) {
            console.error('Error updating floor plan:', error);
            alert('Error updating floor plan. Please try again.');
        }
    };

    const clearForm = () => {
        setSelectedPlan(null);
        setName('');
        setDescription('');
        setRooms([]);
        setNewRoom({ roomNumber: '', capacity: '', booked: false, seats: [] });
    };

    const handleAddRoom = () => {
        if (newRoom.roomNumber && newRoom.capacity) {
            const roomWithSeats = {
                ...newRoom,
                seats: Array.from({ length: newRoom.capacity }, (_, index) => ({
                    seatNumber: index + 1,
                    occupied: false,
                })),
            };
            setRooms([...rooms, roomWithSeats]);
            setNewRoom({ roomNumber: '', capacity: '', booked: false, seats: [] });
        } else {
            alert('Please fill in all room details.');
        }
    };

    const handleRoomChange = (index, key, value) => {
        const updatedRooms = rooms.map((room, roomIndex) => {
            if (roomIndex === index) {
                let updatedRoom = { ...room, [key]: value };

                if (key === 'capacity') {
                    const newCapacity = parseInt(value, 10);
                    const currentCapacity = room.seats.length;

                    if (newCapacity > currentCapacity) {
                        // Add new seats
                        const additionalSeats = Array.from({ length: newCapacity - currentCapacity }, (_, i) => ({
                            seatNumber: currentCapacity + i + 1,
                            occupied: false,
                        }));
                        updatedRoom.seats = [...room.seats, ...additionalSeats];
                    } else if (newCapacity < currentCapacity) {
                        // Remove extra seats
                        updatedRoom.seats = room.seats.slice(0, newCapacity);
                    }
                }

                return updatedRoom;
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    const handleSeatChange = (roomIndex, seatIndex, value) => {
        const updatedRooms = rooms.map((room, index) => {
            if (index === roomIndex) {
                const updatedSeats = room.seats.map((seat, sIndex) =>
                    sIndex === seatIndex ? { ...seat, occupied: value === 'Occupied' } : seat
                );
                return { ...room, seats: updatedSeats };
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    const handleDeleteRoom = (index) => {
        const updatedRooms = rooms.filter((_, roomIndex) => roomIndex !== index);
        setRooms(updatedRooms);
    };

    // Handle seat deletion
    const handleDeleteSeat = (roomIndex, seatIndex) => {
        const updatedRooms = rooms.map((room, index) => {
            if (index === roomIndex) {
                // Remove the selected seat
                const updatedSeats = room.seats.filter((_, sIndex) => sIndex !== seatIndex);

                // Reassign seat numbers
                const reNumberedSeats = updatedSeats.map((seat, i) => ({
                    ...seat,
                    seatNumber: i + 1, // Seat numbers start from 1
                }));

                return { ...room, seats: reNumberedSeats };
            }
            return room;
        });
        setRooms(updatedRooms);
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Modify Floor Plans
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <List>
                        {floorPlans.length === 0 ? (
                            <Typography variant="h6" align="center">No plans to modify</Typography>
                        ) : (
                            floorPlans.map((plan) => (
                                <ListItem button key={plan._id} onClick={() => handleSelectPlan(plan)}>
                                    <ListItemText primary={plan.name} secondary={plan.description} />
                                    <ListItemSecondaryAction>
                                        <Button variant="outlined" onClick={() => handleSelectPlan(plan)}>
                                            Edit
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))
                        )}
                    </List>
                </Grid>
                {selectedPlan && (
                    <>
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
                        <Grid item xs={12}>
                            <Typography variant="h6">Rooms</Typography>
                            {rooms.map((room, index) => (
                                <div key={index}>
                                    <TextField
                                        label="Room Number"
                                        value={room.roomNumber}
                                        onChange={(e) => handleRoomChange(index, 'roomNumber', e.target.value)}
                                    />
                                    <TextField
                                        label="Capacity"
                                        type="number"
                                        value={room.capacity}
                                        onChange={(e) => handleRoomChange(index, 'capacity', e.target.value)}
                                    />
                                    <Button onClick={() => handleDeleteRoom(index)}>
                                        <Delete />
                                    </Button>
                                    <Typography variant="subtitle1">Seats</Typography>
                                    {room.seats.map((seat, seatIndex) => (
                                        <div key={seatIndex} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span>Seat {seat.seatNumber}: </span>
                                            <select
                                                value={seat.occupied ? 'Occupied' : 'Available'}
                                                onChange={(e) => handleSeatChange(index, seatIndex, e.target.value)}
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Occupied">Occupied</option>
                                            </select>
                                            <IconButton onClick={() => handleDeleteSeat(index, seatIndex)}>
                                                <Delete />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">Add New Room</Typography>
                            <TextField
                                label="Room Number"
                                value={newRoom.roomNumber}
                                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                            />
                            <TextField
                                label="Capacity"
                                type="number"
                                value={newRoom.capacity}
                                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                            />
                            <Button variant="contained" onClick={handleAddRoom}>
                                Add Room
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                onClick={handleUpdatePlan}
                            >
                                Update Floor Plan
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                onClick={clearForm}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </>
                )}
            </Grid>
        </Container>
    );
}

export default ModifyPlan;
