        let trackUris;
        let playlistLink;
        // Spotify API-Konfiguration
        const clientId = "adb14e73d6a54b8fb6212c66a18475dd"; // Deine Spotify Client-ID
        const redirectUri = "https://severepuppet.github.io/spotify"; // Deine Redirect-URL
        const scopes = [
            "user-read-playback-state",
            "user-modify-playback-state",
            "streaming",
        ];
        let accessToken = "";

        // URL für Spotify-Login generieren
        const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scopes.join("%20")}&redirect_uri=${encodeURIComponent(redirectUri)}`;

        // Event-Listener für Login-Button
        document.getElementById("login-btn").addEventListener("click", () => {
            window.location.href = authUrl;
        });

        // Access Token aus der URL extrahieren
        function getAccessTokenFromUrl() {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            return params.get("access_token");
        }

        // Token holen und Buttons aktivieren
        document.addEventListener("DOMContentLoaded", () => {
            accessToken = getAccessTokenFromUrl();
            if (accessToken) {
                document.getElementById("play-btn").disabled = false;
                console.log("Access Token erhalten:", accessToken);
            }
        });

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
        
        // Nach der Tokenextraktion, vor dem Zugriff auf die API
        document.addEventListener("DOMContentLoaded", async () => {
            accessToken = getAccessTokenFromUrl();
            if (accessToken) {
                const isValid = await validateAccessToken(accessToken);
                if (isValid) {
                    document.getElementById("play-btn").disabled = false;
                    console.log("Access Token erhalten:", accessToken);
                } else {
                    alert("Das Access Token ist ungültig oder abgelaufen.");
                }
            }
        });

        async function getPlaylistTracks(playlistUrl) {
            // Extrahiere die Playlist-ID aus der URL
            const playlistId = playlistUrl.split('/').pop().split('?')[0];  // Holt den letzten Teil nach dem letzten "/"
            
            // Hole die Tracks der Playlist
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
                return trackUris;  // Gibt die Track-URIs als Array zurück
            } else {
                console.error("Fehler beim Abrufen der Playlist-Titel:", await response.json());
                alert("Fehler beim Abrufen der Playlist!");
                return [];
            }
        }

        function test(){
            playlistLink = document.getElementById("inputPlaylistlink").value;
            console.log(playlistLink);
            getPlaylistTracks(playlistLink).then(tracks => {
            // Du hast nun die Track-URIs in einem Array    
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

        function nextSong(){
            shuffleArray(trackUris);
            playSong(trackUris[0]);
        }
        

        // Song abspielen
        function playSong(trackUri) {
    // Spotify App öffnen
    window.location.href = `spotify:${trackUri}`;
    
}

        // Event-Listener für Play-Button
        document.getElementById("play-btn").addEventListener("click", nextSong);