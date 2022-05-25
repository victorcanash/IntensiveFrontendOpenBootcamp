import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
// import BarChartIcon from '@mui/icons-material/BarChart';

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
            {/* Katas Button */}
            <ListItemButton onClick={() => goToPage('/katas')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Katas" />
            </ListItemButton>
            {/* Users Button */}
            <ListItemButton onClick={() => goToPage('/users')}>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
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
