import React, { useContext } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ApplicationContext } from '../../contexts/ApplicationContext';

import { KatasList } from '../lists/KatasList';


export const Dashboard = () => {

    const { user } = useContext(ApplicationContext);

    return (
        <React.Fragment>
            <Container sx={{ mt: 4, mb: 5 }}>
                <Typography component="h1" variant="h5">
                    Your katas
                </Typography>
            </Container>
            <KatasList owner={user} />
        </React.Fragment>
    );
};
