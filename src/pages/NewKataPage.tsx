import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 

import { ApplicationContext } from '../contexts/ApplicationContext';
import { IKata } from '../utils/interfaces/IKata.interface';

import { KataForm } from '../components/forms/KataForm';


export const NewKataPage = () => {

    const { setLoading } = useContext(ApplicationContext);

    const navigate = useNavigate();

    const onCreatedKata = (createdKata: IKata) => {
        setLoading(false);
        navigate(`/katas/${createdKata._id}`);
    };

    return (
        <React.Fragment>
            <KataForm kata={{} as IKata} onFormSuccess={onCreatedKata} />
        </React.Fragment>
    );
};
