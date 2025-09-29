import React from 'react';
import { Container, Typography } from '@mui/material';

const Home = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to the Automobile Service Store
            </Typography>
            <Typography variant="body1">
                We provide the best services for your automobile needs. Please log in or sign up to get started!
            </Typography>
        </Container>
    );
};

export default Home;
