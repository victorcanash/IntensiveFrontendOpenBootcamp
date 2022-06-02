import React from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from '@mui/styles';

import { IUploadableFile } from './DropzoneField';


const ErrorLinearProgress = withStyles({
    bar: {
        backgroundColor: 'red',
    },
})(LinearProgress);

export interface IDropzoneItemProps {
    uploadableFile: IUploadableFile;
    onDelete: (file: File) => void;
}

export const DropzoneItem = ({ uploadableFile, onDelete }: IDropzoneItemProps) => {

    return (
        <Grid item>
            <FileHeader file={uploadableFile.file} onDelete={onDelete} />
            {
                uploadableFile.errors.length > 0 ?
                    <ItemError uploadableFile={uploadableFile} /> :
                    <ItemSuccess />
            }
        </Grid>
    );
};

const FileHeader = ({ file, onDelete }: { file: File; onDelete: (file: File) => void }) => {
    
    return (
        <Container>
            <Grid sx={{justify: 'space-between', lignItems: 'center'}}>
                <Grid item>
                    {file.name}
                </Grid>
                <Grid item>
                    <Button size="small" onClick={() => onDelete(file)}>
                        Delete
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

const ItemError = ({ uploadableFile }: { uploadableFile: IUploadableFile }) => {

    return (
        <React.Fragment>
            <ErrorLinearProgress variant="determinate" value={100} />
            {uploadableFile.errors.map((error) => (
                <div key={error.code}>
                    <Typography color="error">{error.message}</Typography>
                </div>
            ))}
        </React.Fragment>
    );
};

const ItemSuccess = () => {
    
    return (
        <React.Fragment>
            <LinearProgress variant="determinate" value={100} />
        </React.Fragment>
    );
};
