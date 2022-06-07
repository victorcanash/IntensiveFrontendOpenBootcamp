import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { ApplicationContext } from '../../../contexts/ApplicationContext';
import isEmpty from '../../../utils/isEmpty';
import { getKataByID } from '../../../services/katasService';
import { IKata } from '../../../utils/interfaces/IKata.interface';
// import { IUser } from '../../../utils/interfaces/IUser.interface';

// import { CodeEditor } from '../components/editor/CodeEditor';


export const KataDetail = () => {

    const firstRenderRef = useRef(false)

    const { token, /* user, */ setLoading } = useContext(ApplicationContext);

    const { id } = useParams();

    const [kata, setKata] = useState<IKata>({} as IKata);
    // const [creator, setCreator] = useState<IUser>({} as IUser);
    // const [showSolution, setShowSolution] = useState(false)
    const [errorMsg, setErrorMsg] = useState('');

    const ratingText = `Rating: ${kata.stars?.average} / 5`;

    const getKata = () => {
        if (!id) {
            return onKataFailed(new Error('Something went wrong'));
        }
        getKataByID(token, id).then((response: AxiosResponse) => {
            if(response.status === StatusCodes.OK) {
                onKataSuccess(response);
            } else {
                throw new Error('Something went wrong');
            }
        }).catch((error) => {
            onKataFailed(error);
        });
    };

    const onKataSuccess = (response: AxiosResponse) => {
        const { kata } = response.data;
        setKata(kata);
        console.log(kata);
        setLoading(false);
    };

    const onKataFailed = (error: any) => {
        let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
        console.error(`[Get Kata ERROR]: ${responseMsg}`);
        setErrorMsg(responseMsg);             
        setLoading(false);
    };

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            getKata();
        }
    });

    return (
        <React.Fragment>
            { !isEmpty(kata) ?
                <React.Fragment>
                    <Container sx={{ mt: 4, mb: 5 }}>
                        <Typography component="h1" variant="h5">
                            {kata.name}
                        </Typography>
                    </Container> 

                    <Card sx={{ display: 'flex' }} variant="outlined">
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">
                                {kata.description}
                            </Typography>
                            <Typography variant="subtitle2">
                                {`Level: ${kata.level}`}
                            </Typography>
                            <Typography variant="subtitle2">
                                {`Intents: ${kata.intents}`}
                            </Typography>
                            {/*<Typography variant="subtitle2">
                                {`Creator: ${creator?.name}`}
                            </Typography>*/}
                            <Typography variant="subtitle2">
                                {`Stars: ${ratingText} by ${kata.stars.users.length} users`}
                            </Typography>
                            <Typography variant="subtitle2">
                                {`Number of participants: ${kata.participants.length}`}
                            </Typography>
                        </CardContent>
                    </Card>
                </React.Fragment> 

                :

                errorMsg ?
                    (<p> {errorMsg} </p>) :
                    (<p> No kata found </p>)
            }
        </React.Fragment>
    )
}
