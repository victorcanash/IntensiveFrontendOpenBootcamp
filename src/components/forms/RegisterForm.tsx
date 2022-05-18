import React, { useState, useContext, useEffect, useRef } from 'react';  
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 

import { useFormik } from 'formik';
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
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { register, login, logout } from '../../services/authService';
import { IAuthRegister, IAuthLogin } from '../../utils/interfaces/IAuth.interface';


const validationSchema = Yup.object().shape(
    {
        name: Yup
            .string()
            .min(3, 'Username must have 3 letters minimum')
            .max(12, 'Username must have maximum 12 letters')
            .required('Username is required'),
        email: Yup
            .string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup
            .string()
            .min(8, 'Password too short')
            .required('Password is required'),
        confirm: Yup
            .string()
            .when("password", {
                is: (value: string) => (value && value.length > 0 ? true : false),
                then: Yup.string().oneOf(
                    [Yup.ref("password")], 'Passwords must match'
                )
            })
            .required('You mus confirm your password'),
        age: Yup.number()
            .min(10, 'You must be over 10 years old')
            .required('Age is required')
    }
);

const theme = createTheme();

export const RegisterForm = () => {

    const firstRenderRef = useRef(false);

    const { setLoading } = useContext(ApplicationContext);

    const navigate = useNavigate();

    const loggedIn = useSessionStorage('sessionJWTToken');

    const [errorMsg, setErrorMsg] = useState('');

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirm: '',
            age: 18
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = async (values: {name: string, email: string, password: string, age: number}) => {
        setLoading(true);
        const authRegister: IAuthRegister = {
            name: values.name,
            email: values.email,
            password: values.password,
            age: values.age
        };
        register(authRegister).then(async (response: AxiosResponse) => {
            if (response.status === StatusCodes.CREATED) {
                const authLogin: IAuthLogin = {
                    email: values.email,
                    password: values.password
                };
                await onRegisterSuccess(authLogin);
            } else {
                throw new Error('Something went wrong');
            }
        }).catch((error) => {
            let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
            console.error(`[Register ERROR]: ${responseMsg}`);
            setErrorMsg(responseMsg);
            setLoading(false);
        });
    };

    const onRegisterSuccess = async (authLogin: IAuthLogin) => {
        login(authLogin).then(async (response: AxiosResponse) => {
            if (response.status === StatusCodes.CREATED) {
                if (response.data.token){
                    if (loggedIn) {
                        await logout(loggedIn);
                    }
                    await sessionStorage.setItem('sessionJWTToken', response.data.token);
                    navigate('/');
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
            navigate('/login');
        });
    };

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            setLoading(false);
        }    
    }, [setLoading]);

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
                        Sign up
                    </Typography>

                    <form onSubmit={formik.handleSubmit}>

                        {/* Name Field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            name="name"
                            autoComplete="name"        
                            label="Name"
                            autoFocus
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />

                        {/* Email Field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            label="Email Address"   
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />

                        {/* Password Field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            label="Password"
                            type="password"   
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}      
                        />

                        {/* Confirm Password Field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="confirm"
                            name="confirm"
                            autoComplete="new-confirm"
                            label="Confirm Password"
                            type="password"   
                            value={formik.values.confirm}
                            onChange={formik.handleChange}
                            error={formik.touched.confirm && Boolean(formik.errors.confirm)}
                            helperText={formik.touched.confirm && formik.errors.confirm}      
                        />

                        {/* Age Field */}
                        <TextField 
                            margin="normal"
                            required
                            fullWidth
                            id="age"
                            name="age"
                            autoComplete="age"
                            label="Age"
                            type="number"  
                            inputProps={{min: 10, max: 100}} 
                            value={formik.values.age}
                            onChange={formik.handleChange}
                            error={formik.touched.age && Boolean(formik.errors.age)}
                            helperText={formik.touched.age && formik.errors.age}      
                        />

                        <FormControlLabel
                            control={<Checkbox value="allowExtraEmails" color="primary" />}
                            label="I want to receive inspiration, marketing promotions and updates via email."
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>

                        {
                            errorMsg && errorMsg !== '' ?
                                (<Alert severity="error">{ errorMsg }</Alert>)
                                : null
                        }        

                        <Grid container>
                            <Grid item xs>
                                <Link component={RouterLink} to='/login' variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                        
                    </form>

                </Box>

            </Container>

        </ThemeProvider>
    );
}
