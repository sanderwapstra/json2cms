import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

type Props = {
    onDataLoaded: (fileName: string, data: Record<string, any>) => void;
};

const Dropzone: React.FC<Props> = ({ onDataLoaded }) => {
    const onDrop = useCallback(
        acceptedFiles => {
            acceptedFiles.forEach((file: any) => {
                console.log(`file`, file);
                const reader = new FileReader();

                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');

                reader.onload = () => {
                    if (reader.result) {
                        const result = JSON.parse(reader.result.toString());

                        onDataLoaded(
                            file.path.replace(/\.[^/.]+$/, ''),
                            result
                        );
                    }
                };
                reader.readAsText(file);
            });
        },
        [onDataLoaded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'application/json',
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )}
        </div>
    );
};

export default Dropzone;
