import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { ApplicationContext } from '../../contexts/ApplicationContext';
import { getAllKatas } from '../../services/katasService';
import { getAllKatasById } from '../../services/usersService';
import { IKata } from '../../utils/interfaces/IKata.interface';
import { IUser } from '../../utils/interfaces/IUser.interface';


interface Props {
    owner: IUser
};

export const KatasList: React.FC<Props>= ({owner}) => {

    const firstRenderRef = useRef(false)

    const { token, setLoading } = useContext(ApplicationContext);

    let navigate = useNavigate();

    const [katas, setKatas] = useState([] as IKata[]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMsg, setErrorMsg] = useState('');

    const ratingText = (kata: IKata) => ( 
        `Rating: ${kata?.stars.average} / 5`
    );

    const navigateToKataDetail = (id: string) => {
        navigate(`/katas/${id}`);
    };

    const getKatas = () => {
        if (!owner._id) {
            getAllKatas(token, currentPage).then((response: AxiosResponse) => {
                if(response.status === StatusCodes.OK){
                    onKatasSuccess(response);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                onKatasFailed(error);
            });
        } else {
            getAllKatasById(token, owner._id, currentPage).then((response: AxiosResponse) => {
                if(response.status === StatusCodes.OK){
                    onKatasSuccess(response);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                onKatasFailed(error);
            });
        }
    }

    const onKatasSuccess = (response: AxiosResponse) => {
        let { katas, totalPages, currentPage} = response.data;
        setKatas(katas);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
        setLoading(false);
    };

    const onKatasFailed = (error: any) => {
        let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
        console.error(`[Get All Katas ERROR]: ${responseMsg}`);
        setErrorMsg(responseMsg);             
        setLoading(false);
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
        setLoading(true);
        setCurrentPage(page);
        getKatas();
    };

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            getKatas();
        }
    });

    return (
        <>
            { katas.length > 0 ? 
                <>
                    <Grid item xs={12} md={6}>
                        { katas.map((kata: IKata) => 
                            <CardActionArea component="a" onClick={() => navigateToKataDetail(kata._id)} key={kata._id}>
                                <Card sx={{ display: 'flex' }}>
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography component="h2" variant="h5">
                                            {kata.name}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {kata.description}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Level: ${kata.level}`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Intents: ${kata.intents}`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Stars: ${ratingText(kata)} by ${kata.stars.users.length} users`}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {`Number of participants: ${kata.participants.length}`}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        )}
                    </Grid> 

                    <Stack spacing={2} marginTop={5}>
                        <Pagination 
                            variant="outlined" 
                            color="primary" 
                            count={totalPages} 
                            page={parseInt(currentPage.toString())}
                            onChange={handleChangePage}
                        />
                    </Stack>
                </>
                
                :

                errorMsg ?
                    (<p> {errorMsg} </p>) :
                    (<p> No katas found </p>)
            }
        </>
    )
};