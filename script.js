
// Spotify API-Konfiguration
const clientId = "adb14e73d6a54b8fb6212c66a18475dd"; // Deine Spotify Client-ID
const redirectUri = "https://severepuppet.github.io/spotify/callback"; // Deine Redirect-URL
const scopes = [
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
    "app-remote-control",
    "web-playback"
].join("%20");

let accessToken = localStorage.getItem("spotifyAccessToken"); // Holen des Tokens aus dem localStorage

// URL für Spotify-Login generieren
const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}`;

// Event-Listener für Login-Button
document.getElementById("login-btn").addEventListener("click", () => {
    window.location.href = authUrl;
});

// Token holen und Buttons aktivieren
document.addEventListener("DOMContentLoaded", () => {
    if (accessToken) {
        document.getElementById("play-btn").disabled = false;
        console.log("Access Token erhalten:", accessToken);
    } else {
        document.getElementById("play-btn").disabled = true;
        console.log("Kein Access Token gefunden.");
    }
});

// Funktion zum Validieren des Tokens
async function validateAccessToken(token) {
    const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.ok) {
        // Token ist gültig
        console.log("Token validiert.");
        return true;
    } else {
        // Token ist ungültig oder abgelaufen
        console.error("Token ungültig oder abgelaufen.");
        return false;
    }
}

console.log("Auth URL:", authUrl); // Prüfen, ob die URL korrekt ist


/*
// Playlist-Titel abfragen
async function getPlaylistTracks(playlistUrl) {
    const playlistId = playlistUrl.split('/').pop().split('?')[0];  // Playlist-ID extrahieren
    
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,  // Access Token muss hier gültig sein
        }
    });

    if (response.ok) {
        const data = await response.json();
        const tracks = data.items;

        // Speichern der Tracks in einem Array
        trackUris = tracks.map(track => track.track.uri);  // Nur die URIs der Tracks extrahieren
        console.log("Tracks in der Playlist:", trackUris);
        return trackUris;
    } else {
        console.error("Fehler beim Abrufen der Playlist-Titel:", await response.json());
        alert("Fehler beim Abrufen der Playlist!");
        return [];
    }
}

function test() {
    playlistLink = document.getElementById("inputPlaylistlink").value;
    console.log(playlistLink);
    getPlaylistTracks(playlistLink).then(tracks => {
        console.log("Tracks Array:", tracks);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Elemente tauschen
    }
    return array;
}

function nextSong() {
    shuffleArray(trackUris);
    playSong(trackUris[0]);
}

// Song abspielen
function playSong(trackUri) {
    const webLink = `https://open.spotify.com/track/${trackUri.split(":")[2]}`;
    window.location.href = webLink;
}

// Event-Listener für Play-Button
document.getElementById("play-btn").addEventListener("click", nextSong); */
