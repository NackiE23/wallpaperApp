import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GetFileServerInfo } from '../../wailsjs/go/main/App';


const ImageInfo: React.FC = () => {
    const [searchParams] = useSearchParams();
    const image = searchParams.get('image');

    const [fileServerHost, setFileServerHost] = useState<string>('');
    const [fileServerPath, setFileServerPath] = useState<string>('');

    useEffect(() => {
        GetFileServerInfo()
            .then((res) => {
                setFileServerHost(res.host);
                setFileServerPath(res.path);
            })
            .catch((error) => {
                console.error("Error fetching file server info:", error);
            });
    }, []);

    return (
        <div>
            <div className="stats">
                <div id="fileServerPath">{fileServerPath}</div>
                <div id="fileServerHost">{fileServerHost}</div>
            </div>
            
            <h1>Image Info Page</h1>
            <p>Image Path: {image}</p>
            <img src={fileServerHost + '/' + image} alt={image!} />
        </div>
    )
}

export default ImageInfo;