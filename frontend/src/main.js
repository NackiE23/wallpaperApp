import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import {GetWallpaperBase64, GetWallpaperPath, Greet} from '../wailsjs/go/main/App';

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

window.onload = () => {
    GetWallpaperBase64("D:\\обои\\AkameGaKill\\akame_s_night_journey_by_imzigs_dgr1rbs.png").then((base64Image) => {
        document.getElementById("currentWallpaper").src = 'data:image/jpeg;base64,' + base64Image;
    })
}

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
