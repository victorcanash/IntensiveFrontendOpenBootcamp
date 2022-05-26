import React, { useState, useContext, useEffect, useRef } from 'react';  
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

import { ApplicationContext } from '../../contexts/ApplicationContext';
import { login, logout } from '../../services/authService';
import { IAuthLogin } from '../../utils/interfaces/IAuth.interface';
import { IUser } from '../../utils/interfaces/IUser.interface';
import { getCredentials } from '../../utils/auth';
import { setLocalStorageItem } from '../../utils/storage';
import STORAGE_KEYS from '../../constants/storageKeys';


const validationSchema = Yup.object().shape(
    {
        email: Yup
            .string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup
            .string()
            .min(8, 'Password too short')
            .required('Password is required'),
    }
);

const theme = createTheme();

export const LoginForm = () => {

    const firstRenderRef = useRef(false);

    const { token, setLoading, setToken, setUser } = useContext(ApplicationContext);

    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('');

    const initialValues = { 
        email: '',
        password: '',
    };

    const handleSubmit = async (values: {email: string, password: string}) => {
        setLoading(true);
        const authLogin: IAuthLogin = {
            email: values.email,
            password: values.password
        };
        login(authLogin).then(async (response: AxiosResponse) => {
            if (response.status === StatusCodes.CREATED) {
                if (response.data.token){
                    if (token !== '') {
                        await logout(token);
                    }
                    await setLocalStorageItem(STORAGE_KEYS.JWTToken, response.data.token);
                    getCredentials().then((response: {token: string, user: IUser}) => {
                        setToken(response.token);
                        setUser(response.user);
                        navigate('/');
                    });
                } else {
                    throw new Error('Error generating login token');
                }
            } else {
                throw new Error('Something went wrong');
            }
        }).catch((error) => {
            let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
            console.error(`[Login ERROR]: ${responseMsg}`);
            setErrorMsg(responseMsg);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            setLoading(false);
        }    
    });

    return (
        <ThemeProvider theme={theme}>

            <Container component="main" maxWidth="xs">

                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Avatar 
                        sx={{ 
                            m: 1, 
                            bgcolor: 'secondary.main' 
                        }}
                    >
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {props => (
                            <Form>

                                {/* Email Field */}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    label="Email Address"
                                    autoFocus
                                    value={props.values.email}
                                    onChange={props.handleChange}
                                    error={props.touched.email && Boolean(props.errors.email)}
                                    helperText={props.touched.email && props.errors.email}
                                />

                                {/* Password Field */}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    label="Password"
                                    value={props.values.password}
                                    onChange={props.handleChange}
                                    error={props.touched.password && Boolean(props.errors.password)}
                                    helperText={props.touched.password && props.errors.password}
                                />

                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />

                                {/* SUBMIT FORM */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    /*disabled={ formik.isSubmitting || !formik.isValid || !formik.touched.email }*/
                                >
                                    Sign In
                                </Button>

                                {
                                    errorMsg && errorMsg !== '' &&
                                        <Alert severity="error">{ errorMsg }</Alert>
                                } 

                                <Grid container>
                                    <Grid item xs>
                                        <Link component={RouterLink} to="/login" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link component={RouterLink} to="/register" variant="body2">
                                            Don't have an account? Sign Up
                                        </Link>
                                    </Grid>
                                </Grid>

                            </Form>
                        )}
                    </Formik>

                </Box>

            </Container>

        </ThemeProvider>
    );
};
