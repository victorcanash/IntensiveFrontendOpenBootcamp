import React, { useState, useContext, useEffect, useRef } from 'react';  

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';

import { ApplicationContext } from '../../contexts/ApplicationContext';
import { createKata, updateKata, updateKataFiles } from '../../services/katasService';
import { IKata, IKataUpdate, KataLevels } from '../../utils/interfaces/IKata.interface';

import { DropzoneField } from '../dropzone/DropzoneField';


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
            .min(1, 'Minimum of 1 intents')
            .max(1000, 'Maximum of 1000 intents')
            .required('Intents are required'),
        files: Yup.array()
            .min(1, 'Minimum of 1 file')
            .max(3, 'Maximum of 3 files')
            .required('Files are required')
    }
);

interface IProps {
    kata: IKata;
    onFormSuccess: (model: IKata) => void;
};

export const KataForm = ({ kata, onFormSuccess }: IProps) => {

    const firstRenderRef = useRef(false);

    const { token, setLoading } = useContext(ApplicationContext);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const initialValues = {
        name: kata?.name || '',
        description: kata?.description || '',
        level: kata?.level || KataLevels.BASIC,
        intents: kata?.intents || 1,
        files: kata?.files || []
    };

    let uploadFiles: File[] = [];

    const handleUploadFiles = (files: File[]) => {
       uploadFiles = files;
    }

    const handleSubmit = async (values: {name: string, description: string, level: KataLevels, intents: number, files: string[]}) => {
        setLoading(true);
        const kataUpdate: IKataUpdate = {
            name: values.name,
            description: values.description,
            level: values.level,
            intents: values.intents
        };
        sendKataData(kataUpdate);
    };

    const sendKataData = (kataUpdate: IKataUpdate) => {
        if (!kata._id) {
            createKata(token, kataUpdate).then(async (response: AxiosResponse) => {
                if (response.status === StatusCodes.CREATED) {
                    sendKataDataSuccess(response);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                formFailed(error, 'Create Kata ERROR');
            });
        } else {
            updateKata(token, kata._id, kataUpdate).then(async (response: AxiosResponse) => {
                if (response.status === StatusCodes.CREATED) {
                    sendKataDataSuccess(response);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                formFailed(error, 'Update Kata ERROR');
            });
        }
    };

    const sendKataDataSuccess = (response: AxiosResponse) => {
        const kataResponse = getKataModel(response);
        sendKataFiles(kataResponse);
    };

    const sendKataFiles = (kataModel: IKata) => {
        updateKataFiles(token, kataModel._id, uploadFiles).then(async (response: AxiosResponse) => {
            if (response.status === StatusCodes.CREATED) {
                sendKataFilesSuccess(response);
            } else {
                throw new Error('Something went wrong');
            }
        }).catch((error) => {
            formFailed(error, 'Update Kata Files ERROR');
        });
    }

    const sendKataFilesSuccess = (response: AxiosResponse) => {
        const kataResponse = getKataModel(response);
        setSuccessMsg('Form success');
        onFormSuccess(kataResponse);
    };

    const formFailed = (error: any, errorTitle: string) => {
        const responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
        console.error(`[${errorTitle}]: ${responseMsg}`);
        setErrorMsg(responseMsg);
        setLoading(false);
    }

    const getKataModel = (response: AxiosResponse) => {
        return {
            _id: response.data.kata._id,
            name: response.data.kata.name,
            description: response.data.kata.description,
            level: response.data.kata.level,
            intents: response.data.kata.intents,
            stars: response.data.kata.stars,           
            creator: response.data.kata.creator,
            participants: response.data.kata.participants,
            files: response.data.kata.files
        } as IKata;
    };

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            setLoading(false);
        }    
    });

    return (
        <React.Fragment>
            <Typography component="h1" variant="h5">
                { 
                    kata ?
                        ('Create new kata') :
                        ('Update kata')
                }
            </Typography>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {props => (
                    <Form>

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
                            value={props.values.name}
                            onChange={props.handleChange}
                            error={props.touched.name && Boolean(props.errors.name)}
                            helperText={props.touched.name && props.errors.name}
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
                            value={props.values.description}
                            onChange={props.handleChange}
                            error={props.touched.description && Boolean(props.errors.description)}
                            helperText={props.touched.description && props.errors.description}
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
                            value={props.values.level}
                            onChange={props.handleChange}
                            error={props.touched.level && Boolean(props.errors.level)}
                            helperText={props.touched.level && props.errors.level}
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
                            value={props.values.intents}
                            onChange={props.handleChange}
                            error={props.touched.intents && Boolean(props.errors.intents)}
                            helperText={props.touched.intents && props.errors.intents}      
                        />

                        {/* Files Field */}
                        <DropzoneField 
                            name="files" 
                            onChangeFiles={handleUploadFiles}
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

                    </Form>
                )}
            </Formik>
        </React.Fragment>
    );
};
