import { useState } from 'react';

import { Dropzone, FileItem, FileValidated, FullScreenPreview, VideoPreview } from '@dropzone-ui/react';

import envConfig from '../../utils/config/env.config';


interface IProps {
    kataId: string
};

export const FileUploader = ({ kataId }: IProps) => {

    const [files, setFiles] = useState<FileValidated[]>([]);
    const [imageSrc, setImageSrc] = useState<any>(undefined);
    const [videoSrc, setVideoSrc] = useState<any>(undefined);

    const updateFiles = (incommingFiles: FileValidated[]) => {
        setFiles(incommingFiles);
    };

    const handleSee = (imageSource: any) => {
        setImageSrc(imageSource);
    };

    const handleClean = (files: FileValidated[]) => {
        // console.log("list cleaned", files);
    };

    const handleWatch = (vidSrc: any) => {
        setVideoSrc(vidSrc);
    };

    const removeFile = (id: string | number | undefined) => {
        if(id){
            setFiles(files.filter((x) => x.id !== id));
        }
    };

    return (
        <Dropzone 
            style={{ minWidth: "505px" }}
            label="Drag'n drop files here or click to browse"
            onClean={handleClean}
            onChange={updateFiles} 
            value={files}
            maxFiles={3}
            maxFileSize={209715200}
            url={`${envConfig.BACKEND_API_BASE_URL} + /katas/files/ + ${kataId}`}
            fakeUploading
        >
        {files.map((file: FileValidated) => (
            <FileItem 
                {...file} 
                key={file.id} 
                onDelete={() => removeFile(file.id)}
                onSee={handleSee}
                onWatch={handleWatch}
                preview
                info
                resultOnTooltip
                hd
                localization={"ES-es"}
            />
        ))}
        <FullScreenPreview
                imgSource={imageSrc}
                openImage={imageSrc}
                onClose={(e: any) => handleSee(undefined)}
            />
            <VideoPreview
                videoSrc={videoSrc}
                openVideo={videoSrc}
                onClose={(e: any) => handleWatch(undefined)}
                controls
                autoplay
            />
        </Dropzone>
    );
};
