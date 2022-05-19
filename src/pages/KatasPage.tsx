import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { ApplicationContext } from '../contexts/ApplicationContext';
import { getAllKatas } from '../services/katasService';
import { IKata } from '../utils/interfaces/IKata.interface';


export const KatasPage = () => {

    const firstRenderRef = useRef(false)

    const { token, user, setLoading } = useContext(ApplicationContext);

    let navigate = useNavigate();

    const [katas, setKatas] = useState([] as IKata[]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMsg, setErrorMsg] = useState('');

    const ratingText = (kata: IKata) => ( 
        `Rating: ${kata?.stars} / 5`
    );

    const navigateToKataDetail = (id: number) => {
        navigate(`/katas/${id}`);
    }

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            if (!token || !user) {
                return navigate('/login');
            } 
            getAllKatas(token, currentPage).then((response: AxiosResponse) => {
                if(response.status === StatusCodes.OK){
                    let { katas, totalPages, currentPage} = response.data;
                    setKatas(katas);
                    setTotalPages(totalPages);
                    setCurrentPage(currentPage);
                    setLoading(false);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
                console.error(`[Get All Katas ERROR]: ${responseMsg}`);
                setErrorMsg(responseMsg);             
                setLoading(false);
            });
        }
    }, [currentPage, navigate, setLoading, token, user]);

    return (
        <div>
            <h1>
                Katas Page
            </h1>

            { katas.length > 0 ? 
                    <div>
                        {/* TODO: Export to isolated Component */}
                        { katas.map((kata: IKata) => 
                            (
                                <div key={kata._id}>
                                    <h3 onClick={() => navigateToKataDetail(kata._id)} >{kata.name}</h3>
                                    <h4>{kata.description}</h4>
                                    <h5>Creator: {kata.creator}</h5>
                                    <p>{ratingText(kata)}</p>
                                </div>
                            )
                        )}
                    </div>
                :
                    <div>
                        <h5>
                            No katas found
                        </h5>
                    </div>
            }
            
        </div>
    )
}
