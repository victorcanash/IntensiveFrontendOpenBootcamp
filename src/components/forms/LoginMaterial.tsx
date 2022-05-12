import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AxiosResponse } from 'axios';

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

import { login } from '../../services/authService';
import { IAuthLogin } from '../../utils/interfaces/IAuth.interface';


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

export const LoginMaterial = () => {

    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = async (values: {email: string, password: string}) => {
        const authLogin: IAuthLogin = {
            email: values.email,
            password: values.password
        };
        login(authLogin).then(async (response: AxiosResponse) => {
            if (response.status === 200) {
                if (response.data.token){
                    await sessionStorage.setItem('sessionJWTToken', response.data.token);
                    navigate('/');
                } else {
                    throw new Error('Error generating Login Token');
                }
            } else {
                throw new Error('Invalid Credentials');
            }
        }).catch((error) => console.error(`[Login ERROR]: Something went wrong: ${error}`))
    };

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

                    <form onSubmit={formik.handleSubmit}>

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
                            type="password"
                            autoComplete="current-password"
                            label="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
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

                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>

                    </form>

                </Box>

            </Container>

        </ThemeProvider>
    );
}
