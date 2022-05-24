import React, { useState, useContext, useEffect, useRef } from 'react';  

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';

import { ApplicationContext } from '../../contexts/ApplicationContext';
import { createKata, updateKata } from '../../services/katasService';
import { IKata, IKataUpdate, KataLevels } from '../../utils/interfaces/IKata.interface';


const validationSchema = Yup.object().shape(
    {
        name: Yup
            .string()
            .min(3, 'Name too short')
            .required('Name is required'),
        description: Yup
            .string()
            .min(3, 'Description too short')
            .required('Description is required'),
        level: Yup
            .string()
            .required('Level is required'),
        intents: Yup.number()
            .min(1, 'Minimum of intents 1')
            .max(1000, 'Maximum of intents 1000')
            .required('Intents is required'),
    }
);

interface Props {
    kata: IKata;
    onFormSuccess: (createdKata: IKata) => void;
};

export const KataForm: React.FC<Props> = ({kata, onFormSuccess}) => {

    const firstRenderRef = useRef(false);

    const { token, setLoading } = useContext(ApplicationContext);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const formik = useFormik({
        initialValues: {
            name: kata?.name || '',
            description: kata?.description || '',
            level: kata?.level || KataLevels.BASIC,
            intents: kata?.intents || 1
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = async (values: {name: string, description: string, level: KataLevels, intents: number}) => {
        setLoading(true);
        const newKata: IKataUpdate = {
            name: values.name,
            description: values.description,
            level: values.level,
            intents: values.intents
        };
        if (!kata._id) {
            createKata(token, newKata).then(async (response: AxiosResponse) => {
                if (response.status === StatusCodes.CREATED) {
                    setSuccessMsg('Created Kata');
                    formSuccess(response);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                formFailed(error);
            });
        } else {
            updateKata(token, newKata).then(async (response: AxiosResponse) => {
                if (response.status === StatusCodes.CREATED) {
                    setSuccessMsg('Updated Kata');
                    formSuccess(response);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                formFailed(error);
            });
        }
    };

    const formSuccess = (response: AxiosResponse) => {
        let kataData = {
            _id: response.data._id,
            name: response.data.name,
            description: response.data.description,
            level: response.data.level,
            intents: response.data.intents,
            stars: response.data.stars,           
            creator: response.data.creator,
            participants: response.data.participants,
            files: response.data.files
        } as IKata;
        formik.resetForm();
        onFormSuccess(kataData);
    };

    const formFailed = (error: any) => {
        let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
        console.error(`[Update Kata ERROR]: ${responseMsg}`);
        setErrorMsg(responseMsg);
        setLoading(false);
    }

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            setLoading(false);
        }    
    }, [setLoading]);

    return (
        <>
            <Typography component="h1" variant="h5">
                { 
                    kata ?
                        ('Create new kata') :
                        ('Update kata')
                }
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

                {/* Description Field */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="description"
                    name="description"
                    autoComplete="description"
                    label="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />

                {/* Level Field */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="level"
                    name="level"
                    select
                    label="Level"
                    value={formik.values.level}
                    onChange={formik.handleChange}
                    error={formik.touched.level && Boolean(formik.errors.level)}
                    helperText={formik.touched.level && formik.errors.level}
                >
                    {(Object.keys(KataLevels) as (keyof typeof KataLevels)[]).map(
                        (key, option) => (
                            <MenuItem key={KataLevels[key]} value={KataLevels[key]}>
                                {KataLevels[key]}
                            </MenuItem>
                        )
                    )}
                </TextField>

                {/* Intents Field */}
                <TextField 
                    margin="normal"
                    required
                    fullWidth
                    id="intents"
                    name="intents"
                    autoComplete="intents"
                    label="Intents"
                    type="number"  
                    inputProps={{min: 1, max: 1000}} 
                    value={formik.values.intents}
                    onChange={formik.handleChange}
                    error={formik.touched.intents && Boolean(formik.errors.intents)}
                    helperText={formik.touched.intents && formik.errors.intents}      
                />

                {/* SUBMIT FORM */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    /*disabled={ formik.isSubmitting || !formik.isValid || !formik.touched.email }*/
                >
                    Create
                </Button>

                {
                    errorMsg && errorMsg !== '' &&
                        <Alert severity="error">{ errorMsg }</Alert>
                } 
                {
                    successMsg && successMsg !== '' &&
                        <Alert severity="success">{ successMsg }</Alert>
                } 

            </form>
        </>
    );
};
