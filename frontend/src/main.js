import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import {GetLocalWallpapersJSON, GetWallpaperBase64, GetWallpaperPath, Greet} from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
    <img id="logo" class="logo">
      <div class="result" id="result">Please enter your name below 👇</div>
      <div class="input-box" id="input">
        <input class="input" id="name" type="text" autocomplete="off" />
        <button class="btn" onclick="greet()">Greet</button>
      </div>
    </div>
`;
document.getElementById('logo').src = logo;

let nameElement = document.getElementById("name");
nameElement.focus();
let resultElement = document.getElementById("result");

// window.onload = () => {
//     GetWallpaperBase64("D:\\обои\\AkameGaKill\\akame_s_night_journey_by_imzigs_dgr1rbs.png").then((base64Image) => {
//         document.getElementById("currentWallpaper").src = 'data:image/jpeg;base64,' + base64Image;
//     })
// }

async function loadWallpapers() {
    try {
        const foldersJSON = await GetLocalWallpapersJSON("D:\\обои");
        const folders = JSON.parse(foldersJSON);

        const foldersElement = document.getElementById("folders");

        folders.forEach(folder => {
            // Create a new UL element for the folder
            const ul = document.createElement("ul");
            ul.textContent = folder.name; // Set the folder name as the text content of the UL

            // Create LI elements for each file in the folder
            folder.files.forEach(file => {
                const li = document.createElement("li");
                li.textContent = file; // Set the file name as the text content of the LI
                ul.appendChild(li); // Append the LI to the UL
            });

            // Append the UL to the foldersElement
            foldersElement.appendChild(ul);
        });
    } catch (error) {
        console.log("Failed to load wallpapers:", error)
    }
}

document.addEventListener('DOMContentLoaded', loadWallpapers);

window.getwall = function() {
    GetWallpaperPath().then((result) => {
        document.getElementById("wallppaperPath").innerText = result;
    })
}

// Setup the greet function
window.greet = function () {
    // Get name
    let name = nameElement.value;

    // Check if the input is empty
    if (name === "") return;

    // Call App.Greet(name)
    try {
        Greet(name)
            .then((result) => {
                // Update result with data back from App.Greet()
                resultElement.innerText = result;
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};
