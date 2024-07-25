import './style.css';
import './folders.css';

import logo from './assets/images/logo-universal.png';
import {GetLocalWallpapersJSON, GetWallpaperBase64, GetWallpaperPath, CheckFileExists, GetFileServerInfo} from '../wailsjs/go/main/App';

var fileServerHost, fileServerPath;

GetFileServerInfo().then((res) => {
    fileServerHost = res.host;
    fileServerPath = res.path;
    console.log("fileServerHost: ", fileServerHost)
    console.log("fileServerPath: ", fileServerPath)
    document.getElementById("fileServerHost").innerText = fileServerHost;
    document.getElementById("fileServerPath").innerText = fileServerPath;
});


async function loadWallpapers() {
    try {
        const foldersJSON = await GetLocalWallpapersJSON("D:\\обои");
        const folders = JSON.parse(foldersJSON);

        const foldersElement = document.getElementById("folders");

        folders.forEach(folder => {
            const span = document.createElement("span");
            span.classList.add("listName");
            span.innerHTML = `${folder.name} (${folder.files.length}) <span class="loadAll">Load All Images</span>`;
            foldersElement.appendChild(span);

            // Create a new UL element for the folder
            const ul = document.createElement("ul");

            // Create LI elements for each file in the folder
            folder.files.forEach(file => {
                const li = document.createElement("li");
                li.textContent = file; // Set the file name as the text content of the LI
                li.dataset.folder = folder.name;
                ul.appendChild(li); // Append the LI to the UL
            });

            // Append the UL to the foldersElement
            foldersElement.appendChild(ul);
        });

        document.querySelectorAll("#folders ul li").forEach(li => {
            li.addEventListener("click", (e) => {
                if (!fileServerHost && !fileServerPath) {
                    let imagePath = e.target.dataset.folder + "\\" + e.target.innerText;
                    console.log(imagePath);
                    GetWallpaperBase64(imagePath).then((base64Image) => {
                        const img = document.createElement("img");
                        img.src = 'data:image/jpeg;base64,' + base64Image;
                        e.target.replaceWith(img);
                    });
                } else {
                    const img = document.createElement("img");
                    img.src = `${fileServerHost}${e.target.dataset.folder.replace(fileServerPath, "").replaceAll("\\", "/")}/${e.target.innerText}`;
                    e.target.replaceWith(img);
                }
            });            
        });

        document.querySelectorAll("#folders .listName .loadAll").forEach(span => {
            span.addEventListener("click", (e) => {
                const ul = e.target.parentElement.nextElementSibling;

                if (ul && ul.tagName === "UL") {
                    ul.querySelectorAll("li").forEach(li => {
                        li.click();
                    });
                }
            })
        });
    } catch (error) {
        console.log("Failed to load wallpapers:", error)
    }
}

document.addEventListener('DOMContentLoaded', loadWallpapers);

window.getwall = async function() {
    try {
        const result = await GetWallpaperPath();
        document.getElementById("wallppaperPath").innerText = result;
        
        const fileExists = await CheckFileExists(result);
        if (fileExists) {
            const base64Image = await GetWallpaperBase64(result);
            const img = document.createElement("img");
            img.src = 'data:image/jpeg;base64,' + base64Image;
            let wallpaperEl = document.getElementById("wallpaper");
            wallpaperEl.innerHTML = "";
            wallpaperEl.append(img);
        }
    } catch (error) {
        console.error("Error fetching wallpaper:", error);
    }
}

