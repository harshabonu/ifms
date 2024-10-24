import React, { useEffect, useState } from 'react';
import {
    Button,
    Typography,
    Grid,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import api from './axios'; // Import your custom Axios instance

function DeletePlan() {
    const [floorPlans, setFloorPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [message, setMessage] = useState('');

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
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
    };

    const handleDeletePlan = async () => {
        if (!selectedPlan) return; // Ensure a plan is selected
        try {
            await api.delete(`/admin/floorPlan/${selectedPlan._id}`); // Use relative URL
            setMessage('Floor plan deleted successfully!');
            fetchFloorPlans(); // Refresh the list after deletion
            setSelectedPlan(null); // Clear the selected plan
        } catch (error) {
            console.error('Error deleting floor plan:', error);
            setMessage('Error deleting floor plan. Please try again.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Delete Floor Plans
            </Typography>
            {message && (
                <Typography variant="body1" color="error" align="center">
                    {message}
                </Typography>
            )}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {floorPlans.length === 0 ? (
                        <Typography variant="body1" align="center">
                            No plans to delete.
                        </Typography>
                    ) : (
                        <List>
                            {floorPlans.map((plan) => (
                                <ListItem button key={plan._id} onClick={() => handleSelectPlan(plan)}>
                                    <ListItemText primary={plan.name} secondary={plan.description} />
                                    <ListItemSecondaryAction>
                                        <Button variant="outlined" color="secondary" onClick={() => handleSelectPlan(plan)}>
                                            Select
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
                {selectedPlan && (
                    <Grid item xs={12} align="center">
                        <Typography variant="h6">
                            Are you sure you want to delete: {selectedPlan.name}?
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={handleDeletePlan} style={{ marginRight: '10px' }}>
                            Confirm Delete
                        </Button>
                        <Button variant="outlined" onClick={() => setSelectedPlan(null)}>
                            Cancel
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

export default DeletePlan;
