document.addEventListener("DOMContentLoaded", function() {
    const addLyricsForm = document.getElementById('add-lyrics-form');
    const lyricTitleInput = document.getElementById('lyric-title');
    const lyricArtistInput = document.getElementById('lyric-artist');
    const lyricTextInput = document.getElementById('lyric-text');
    const lyricAlbumInput = document.getElementById('lyric-album');
    const cancelButton = document.getElementById('cancel-add-button');

    addLyricsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const newLyric = {
            id: Date.now(),
            title: lyricTitleInput.value,
            artist: lyricArtistInput.value,
            lyrics: lyricTextInput.value,
            album: lyricAlbumInput.value || "Uncategorized",
            dateAdded: Date.now()
        };

        const storedLyrics = localStorage.getItem('allLyrics');
        let allLyrics = storedLyrics ? JSON.parse(storedLyrics) : [];

        allLyrics.push(newLyric); 
        localStorage.setItem('allLyrics', JSON.stringify(allLyrics));

        window.location.href = 'index.html';
    });

    cancelButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
