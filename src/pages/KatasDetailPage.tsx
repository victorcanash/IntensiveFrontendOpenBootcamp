import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { ApplicationContext } from '../contexts/ApplicationContext';
import { CodeEditor } from '../components/editor/CodeEditor';
import { getKataByID } from '../services/katasService';
import { IKata } from '../utils/interfaces/IKata.interface';


export const KatasDetailPage = () => {

    const firstRenderRef = useRef(false)

    const { token, user, setLoading } = useContext(ApplicationContext);

    let navigate = useNavigate();

    let { id } = useParams();

    const [kata, setKata] = useState<IKata>({} as IKata);
    const [showSolution, setShowSolution] = useState(false)
    const [errorMsg, setErrorMsg] = useState('');

    const ratingText: string = `Rating: ${kata?.stars} / 5`;

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            if (!token || !user) {
                return navigate('/login');
            } 
            if (!id) { 
                return navigate('/katas');
            }
            getKataByID(token, id).then((response: AxiosResponse) => {
                if(response.status === StatusCodes.OK) {
                    let kataData = {
                        _id: response.data._id,
                        name: response.data.name,
                        description: response.data.description,
                        stars: response.data.stars,
                        level: response.data.level,
                        intents: response.data.intents,
                        creator: response.data.creator,
                        solution: response.data.solution,
                        participants: response.data.participants
                    } as IKata;
                    setKata(kataData);
                    setLoading(false);
                } else {
                    throw new Error('Something went wrong');
                }
            }).catch((error) => {
                let responseMsg = error.response?.data?.message ? error.response.data.message : error.message;
                console.error(`[Kata By ID ERROR]: ${responseMsg}`);
                setErrorMsg(responseMsg);             
                setLoading(false);
            });
        }
    }, [id, navigate, setLoading, token, user]);

    return (
        <div>
            <h1>
                Kata Detail Page: { id }
            </h1>
            { kata ? 
                <div className='kata-data'>
                    <h2> {kata?.description} </h2>
                    <h3> {ratingText} </h3>
                    <button onClick={() => setShowSolution(!showSolution)}>
                        {showSolution ? 'Show Solution': 'Hide Solution'}
                    </button>

                    { showSolution ? null : <CodeEditor> {kata.solution} </CodeEditor> }
                </div>    
            :
                <div>
                    <h2>
                        Loading data...
                    </h2>
                </div>    
            }
        </div>
    )
}
