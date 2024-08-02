import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { GetFileServerInfo, GetLocalWallpapersJSON, SetWallpaper } from '../../wailsjs/go/main/App';
import "./imageinfo.css";
import { Folder } from '../types';


const ImageInfo: React.FC = () => {
    const { scrollToTop } = useOutletContext<{ scrollToTop: () => void }>();
    const [searchParams] = useSearchParams();
    const [selectedImage, setSelectedImage] = useState<string>(searchParams.get('image') || '');

    const [fileServerHost, setFileServerHost] = useState<string>('');
    const [fileServerPath, setFileServerPath] = useState<string>('');
    const [similarImages, setSimilarImages] = useState<Folder[]>([]);

    useEffect(() => {
        GetFileServerInfo()
            .then((res) => {
                setFileServerHost(res.host);
                setFileServerPath(res.path.replace(/\\/g, '/'));
            })
            .catch((error) => {
                console.error("Error fetching file server info:", error);
            });
    }, []);

    useEffect(() => {
        if (fileServerPath) {
            loadWallpapers();
        }
    }, [fileServerPath]);

    const loadWallpapers = async () => {
        try {
            if (!selectedImage) {
                return;
            }
            const folderPath = fileServerPath + selectedImage.substring(0, selectedImage.lastIndexOf('/'));
            const foldersJSON = await GetLocalWallpapersJSON(folderPath);
            const folders: Folder[] = JSON.parse(foldersJSON);
            setSimilarImages(folders);
        } catch (error) {
            console.log("Failed to load wallpapers:", error);
        }
    };

    const setWallpaper = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!selectedImage || !fileServerPath) {
            return
        }
        const fullPath = fileServerPath + selectedImage;
        SetWallpaper(fullPath);
    }

    const changeSelectedWallpaper = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const imgElement = e.currentTarget;
        setSelectedImage(decodeURIComponent(imgElement.src).replace(fileServerHost, ''));
        scrollToTop();
    }

    return (
        <div>
            <div className="stats">
                <div id="fileServerPath">{fileServerPath}</div>
                <div id="fileServerHost">{fileServerHost}</div>
            </div>
            
            <h1>Image Info Page</h1>
            {selectedImage ? (
                <div className='selectedImageBlock'>
                    <p>Image Path: {selectedImage}</p>
                    <img id='selectedImage' src={fileServerHost + '/' + selectedImage} alt={selectedImage!} />
                    <button onClick={setWallpaper}>Set As Wallpaper</button>
                </div>
            ) : (
                <p>You have to select an image on the <Link className='link' to={"/"}>Home Page</Link></p>
            )}

            <div className="similarImages">
                <h1>Images from the same directory</h1>
                {similarImages && similarImages.map(folder => (
                    <div key={folder.name}>
                        <span className="listName">
                            {folder.name} ({folder.files.length})
                        </span>
                        <div className='similarImagesList'>
                            {folder.files.map(file => (
                                <img
                                    key={file}
                                    src={fileServerHost + folder.name.replace(fileServerPath, "").replaceAll("\\", "/") + "/" + file}
                                    loading='lazy'
                                    onClick={changeSelectedWallpaper}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageInfo;