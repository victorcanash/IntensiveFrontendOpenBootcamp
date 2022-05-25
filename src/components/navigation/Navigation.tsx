import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// import { AxiosResponse } from 'axios';
// import { StatusCodes } from 'http-status-codes';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import  Typography  from '@mui/material/Typography';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
// import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import { ApplicationContext } from '../../contexts/ApplicationContext';
import { logout } from '../../services/authService';
import { IUser } from '../../utils/interfaces/IUser.interface';
import { removeLocalStorageItem } from '../../utils/storage';
import STORAGE_KEYS from '../../constants/storageKeys';

import { MenuItems } from './MenuItems';


const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => (
    {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
        }),
    }
));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen
                }),
                width: theme.spacing(7),
                // Breakpoint to Media Queries of CSS in different display sizes (Responsive Design)
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9)
                }
            })
        }
    })
);

const myTheme = createTheme();

interface IProps {
    page: JSX.Element
};

export const Navigation = ({ page }: IProps) => {

    const firstRenderRef = useRef(false);

    const { token, user, setLoading, setToken, setUser } = useContext(ApplicationContext);

    const navigate = useNavigate();

    const [open, setOpen] = useState(true);
    
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const logoutUser = async () => {
        await logout(token);
        await removeLocalStorageItem(STORAGE_KEYS.JWTToken);
        setToken('');
        setUser({} as IUser);
        navigate('/login');
    };

    const onClickLogoutBtn = async () => {
        /* logout(loggedIn).then(async (response: AxiosResponse) => {
            if (response.status === StatusCodes.CREATED) {
                await sessionStorage.removeItem('sessionJWTToken');
                navigate('/login');
            } else {
                throw new Error('Something went wrong');
            }
        }).catch((error) => {
            let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
            console.error(`[Logout ERROR]: ${responseMsg}`);
        }); */
        setLoading(true);
        await logoutUser();
    };

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            if (!token || !user) {
                return navigate('/login');
            } 
        }
    });

    return (
        <ThemeProvider theme={myTheme}>

            <Box sx= {{ display: 'flex' }}>

                <CssBaseline />

                <AppBar position='absolute' open={open} >
                    <Toolbar sx={{ pr: '24px' }}>
                        {/* ICON TO TOGGLE DRAWER MENU */}
                        <IconButton
                            edge='start'
                            color='inherit'
                            aria-label='open drawer'
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {
                                    display: 'none'
                                })
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {/* Title of App */}
                        <Typography 
                            component='h1'
                            variant='h6'
                            color='inherit'
                            noWrap
                            sx={{
                                flexGrow: 1
                            }}
                            >
                            Code Verification Katas
                        </Typography>
                        {/* ICON to show Notifications */}
                        {/*
                        <IconButton color='inherit'>
                            <Badge badgeContent={10} color='secondary'>
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        */}
                        {/* ICON to Logout */}
                        <IconButton 
                            color='inherit'
                            onClick={onClickLogoutBtn}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Drawer variant='permanent' open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1]
                        }}
                    >
                        {/* ICON to HIDE the Menu */}
                        <IconButton color='inherit' onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    {/* List of menu items */}
                    <List component='nav'>
                        <MenuItems />
                    </List>
                </Drawer>

                <Box 
                    component='main'
                    sx = {{
                        backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto'
                    }}
                >
                    <Toolbar />
                    <Container maxWidth='lg' sx={{ mt: 4, mg: 4 }}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            
                            }}>
                                { 
                                    token && user &&
                                        page 
                                }
                            </Paper>
                        </Grid>
                    </Container>
                </Box>  

            </Box>

        </ThemeProvider>
    );
};
