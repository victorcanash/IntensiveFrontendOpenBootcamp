import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom'; 

import Link from '@mui/material/Link';

import { ApplicationContext } from '../../contexts/ApplicationContext';

import { KatasList } from '../lists/KatasList';


export const Dashboard = () => {

    const { user } = useContext(ApplicationContext);

    return (
        <React.Fragment>
            <Link component={RouterLink} to="/katas/new" variant="body2">
                Create new kata
            </Link>

            <KatasList owner={user} />
        </React.Fragment>
    );
};
