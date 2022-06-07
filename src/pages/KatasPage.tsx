import React from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { KatasList } from '../components/lists/KatasList';


export const KatasPage = () => {

    return (
        <React.Fragment>
            <Container sx={{ mt: 4, mb: 5 }}>
                <Typography component="h1" variant="h5">
                    All katas
                </Typography>
            </Container>
            <KatasList />
        </React.Fragment>
    );
};
