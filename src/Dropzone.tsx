import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as JsonIcon } from './assets/svg/json.svg';

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
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />

            <JsonIcon />

            {isDragActive ? (
                <p>Drop the file here ...</p>
            ) : (
                <p>Drag 'n' drop a JSON file here, or click to select files</p>
            )}
        </div>
    );
};

export default Dropzone;
