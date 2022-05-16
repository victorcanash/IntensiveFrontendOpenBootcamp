import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';

import { CodeEditor } from '../components/editor/CodeEditor';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { getKataByID } from '../services/katasService';
import { IKata } from '../utils/interfaces/IKata.interface';


export const KatasDetailPage = () => {

    let loggedIn = useSessionStorage('sessionJWTToken');
    let navigate = useNavigate();
    // Find id from params
    let { id } = useParams();

    const [kata, setKata] = useState<IKata | undefined>(undefined);
    const [showSolution, setShowSolution] = useState(false)

    const ratingText: string = `Rating: ${kata?.stars} / 5`;

    useEffect(() => {
      if(!loggedIn){
          return navigate('/login');
      } else {
        if (id) {
            getKataByID(loggedIn, id).then((response: AxiosResponse) => {
                  if(response.status === 200 && response.data) {
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
                      }
                      setKata(kataData);
                      console.table(kataData);
                  }
            }).catch((error) => console.error(`[Kata By ID ERROR]: ${error}`))
        } else { 
          return navigate('/katas');
        }
    }
    }, [loggedIn, navigate, id]);

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
