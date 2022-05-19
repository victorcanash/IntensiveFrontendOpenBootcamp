import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// import { AxiosResponse } from 'axios';
// import { StatusCodes } from 'http-status-codes';

import { ApplicationContext } from '../../contexts/ApplicationContext';
// import { NewEditor } from '../editor/NewEditor';
// import { TipTapEditor } from '../editor/TipTapEditor';
import { FileUploader } from '../uploader/FileUploader';


export const Dashboard = () => {

    const firstRenderRef = useRef(false);

    const { token, user, setLoading } = useContext(ApplicationContext);

    let navigate = useNavigate();

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            setLoading(false);
        }
    }, [setLoading]);

    return (
        <>
            
            {/* Code Editor */}
            {/* <NewEditor /> */}
            {/* <TipTapEditor /> */}
            {/* File Uploader */}
            <FileUploader />
                    
        </>
    );
};
