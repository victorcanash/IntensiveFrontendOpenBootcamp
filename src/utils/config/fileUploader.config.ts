export const katasFilesConfig = {
    allowedMimes: {
        'image/jpeg': [
            '.jpeg'
        ],
        'image/jpg': [
            '.jpg'
        ],
        'image/png': [
            '.jpg'
        ],
        'video/mp4': [
            '.mp4'
        ],
        'application/pdf': [
            '.pdf'
        ],
        'application/x-rar-compressed': [         
        ],
        'application/zip': [          
        ],
        'application/x-zip-compressed': [           
        ],
        'application/octet-stream': [        
        ],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
            '.sheet' // xlsx
        ],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
            '.document' // docx
        ],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
            '.presentation' // pptx
        ],
        'multipart/x-zip': [
        ],
    },
    maxFileSize: 209715200, // bytes(B)
    maxFiles: 3
};
