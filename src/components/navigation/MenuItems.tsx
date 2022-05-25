import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';

import { ApplicationContext } from '../../contexts/ApplicationContext';


export const MenuItems = () => {

    const { setLoading } = useContext(ApplicationContext);

    const navigate = useNavigate();
    const location = useLocation();

    const goToPage = (to: string) => {
        if (location.pathname === to) {
            return;
        }
        setLoading(true);
        navigate(to);
    };

    return (
        <React.Fragment>
            {/* Home Button */}
            <ListItemButton onClick={() => goToPage('/')}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
            {/* New Kata Button */}
            <ListItemButton onClick={() => goToPage('/katas/new')}>
                <ListItemIcon>
                    <AddBoxSharpIcon />
                </ListItemIcon>
                <ListItemText primary="Create kata" />
            </ListItemButton>
            {/* Katas Button */}
            <ListItemButton onClick={() => goToPage('/katas')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Find katas" />
            </ListItemButton>
            {/* Users Button */}
            <ListItemButton onClick={() => goToPage('/users')}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Find users" />
            </ListItemButton>
            {/* Ranking Button */}
            {/*<ListItemButton>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Ranking" />
            </ListItemButton>*/}
        </React.Fragment>
    );
};
