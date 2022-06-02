import React, { useCallback, useState, useEffect, useRef } from 'react';

import { useField } from 'formik';
import { FileError, FileRejection, useDropzone } from 'react-dropzone';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

import { katasFilesConfig } from '../../utils/config/fileUploader.config';

import { DropzoneItem } from './DropzoneItem';


const useStyles = makeStyles(() => ({
    dropzone: {
        border: '2px dashed #afafaf',
        borderRadius: '1px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        minHeight: '200px',
        outline: 'none',
    },
}));

let currentId = 0;

const getNewId = () => {
    return ++currentId;
}

export interface IUploadableFile {
    id: number;
    file: File;
    errors: FileError[];
}

export interface IDropzoneFieldProps {
    name: string;
    originFiles?: string[];
    onChangeFiles: (newFiles: File[]) => void;
}

export const DropzoneField = ({ name, onChangeFiles ,originFiles = []}: IDropzoneFieldProps) => {

    const firstRenderRef = useRef(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [input, meta, helpers] = useField({
        name: name,
        type: name,
    });

    const classes = useStyles();

    const [files, setFiles] = useState<IUploadableFile[]>([]);

    const onDrop = useCallback((accFiles: File[], rejFiles: FileRejection[]) => {
        const mappedAcc = accFiles.map((file) => ({ file, errors: [], id: getNewId() }));
        const mappedRej = rejFiles.map((r) => ({ ...r, id: getNewId() }));
        setFiles((curr) => [...curr, ...mappedAcc, ...mappedRej]);
        helpers.setTouched(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDelete = (file: File) => {
        setFiles((curr) => curr.filter((fw) => fw.file !== file));
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: katasFilesConfig.allowedMimes,
        minSize: 0,
        maxSize: katasFilesConfig.maxFileSize,
        // disabled: input.value.length < 4
    });

    useEffect(() => {
        if (!firstRenderRef.current) {
            firstRenderRef.current = true;
            originFiles.forEach((originFile) => {
                let newFile = {
                    id: getNewId(),
                    file: new File([], originFile),
                    errors: []
                } as IUploadableFile;
                setFiles((curr) => [...curr, newFile]);
            });
        }    
    });

    useEffect(() => {
        const uploadFiles: File[] = [];
        files.forEach((uFile: IUploadableFile) => {
            if (uFile.errors?.length < 1) {
                uploadFiles.push(uFile.file);
            } 
        });
        onChangeFiles(uploadFiles);
        helpers.setValue(uploadFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
        <React.Fragment>
            <Grid item>
                <div {...getRootProps({ className: classes.dropzone })}>
                    <input {...getInputProps()} />
                    <p>
                        Drag 'n' drop or click here to select between 1 and 3 files
                    </p>
                </div>
            </Grid>

            {
                files.map((fileWrapper) => (
                    <Grid item key={fileWrapper.id}>
                        <DropzoneItem
                            uploadableFile={fileWrapper}
                            onDelete={onDelete}
                        />
                    </Grid>
                ))
            }

            {meta.touched && meta.error && (
                <Alert severity="error" sx={{ mt: 3, mb: 2 }}>{ meta.error }</Alert>
            )}
        </React.Fragment>
    );
};
