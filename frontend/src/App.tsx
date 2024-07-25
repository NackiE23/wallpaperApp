import React, { useEffect, useState } from 'react';
import { GetLocalWallpapersJSON, GetWallpaperBase64, GetWallpaperPath, CheckFileExists, GetFileServerInfo } from '../wailsjs/go/main/App';
import { Folder } from './types';
import './style.css';
import './folders.css';

const App: React.FC = () => {
    const [fileServerHost, setFileServerHost] = useState<string>('');
    const [fileServerPath, setFileServerPath] = useState<string>('');
    const [folders, setFolders] = useState<Folder[]>([]);
    const [wallpaperPath, setWallpaperPath] = useState<string>('');
    const [wallpaper, setWallpaper] = useState<string>('');

    useEffect(() => {
        GetFileServerInfo().then((res) => {
            setFileServerHost(res.host);
            setFileServerPath(res.path);
        });
        loadWallpapers();
    }, []);

    const loadWallpapers = async () => {
        try {
            const foldersJSON = await GetLocalWallpapersJSON("D:\\обои");
            const folders: Folder[] = JSON.parse(foldersJSON);
            setFolders(folders);
        } catch (error) {
            console.log("Failed to load wallpapers:", error);
        }
    };

    const handleLoadWallpaper = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>, folderName: string, fileName: string) => {
        const li = e.currentTarget;
        let imgSrc: string;

        if (!fileServerHost && !fileServerPath) {
            const imagePath = `${folderName}\\${fileName}`;
            const base64Image = await GetWallpaperBase64(imagePath);
            imgSrc = 'data:image/jpeg;base64,' + base64Image;
        } else {
            imgSrc = `${fileServerHost}${folderName.replace(fileServerPath, "").replaceAll("\\", "/")}/${fileName}`;
        }

        const img = document.createElement('img');
        img.src = imgSrc;
        li.replaceWith(img);
    };

    const handleLoadAll = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const ul = (e.target as HTMLElement).parentElement!.nextElementSibling as HTMLUListElement;
        if (ul) {
            ul.querySelectorAll('li').forEach(li => li.click());
        }
    }

    const getWall = async () => {
        try {
            const result = await GetWallpaperPath();
            setWallpaperPath(result);

            const fileExists = await CheckFileExists(result);
            if (fileExists) {
                const base64Image = await GetWallpaperBase64(result);
                setWallpaper('data:image/jpeg;base64,' + base64Image);
            }
        } catch (error) {
            console.error("Error fetching wallpaper:", error);
        }
    };

    return (
        <div>
            <div className="stats">
                <div id="fileServerPath">{fileServerPath}</div>
                <div id="fileServerHost">{fileServerHost}</div>
            </div>
            <button onClick={getWall}>getwall</button>
            <div id="wallppaperPath">{wallpaperPath}</div>
            <div id="wallpaper">
                {wallpaper && <img src={wallpaper} alt="Wallpaper" />}
            </div>
            <div id="folders">
                {folders.map(folder => (
                    <div key={folder.name}>
                        <span className="listName">
                            {folder.name} ({folder.files.length}) <span className="loadAll" onClick={(e) => handleLoadAll(e)}>Load All Images</span>
                        </span>
                        <ul>
                            {folder.files.map(file => (
                                <li key={file} onClick={(e) => handleLoadWallpaper(e, folder.name, file)}>{file}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
