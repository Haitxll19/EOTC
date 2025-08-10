document.addEventListener("DOMContentLoaded", function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const lyricsList = document.getElementById('lyrics-list');
    const searchInput = document.getElementById('search-input');
    const mainTitle = document.getElementById('main-title');
    
    const fullLyricsView = document.getElementById('full-lyrics-view');
    const fullLyricsTitle = document.getElementById('full-lyrics-title');
    const fullLyricsArtist = document.getElementById('full-lyrics-artist');
    const fullLyricsText = document.getElementById('full-lyrics-text');
    const closeButton = document.getElementById('close-button');

    // NEW: Get the delete button
    const deleteButton = document.getElementById('delete-button');

    let allLyrics = [];
    let currentLyricId = null; // NEW: Variable to hold the ID of the currently viewed lyric

    function sortLyricsFIFO(lyrics) {
        lyrics.sort((a, b) => a.dateAdded - b.dateAdded);
        return lyrics;
    }
    
    function renderLyrics(lyricsToRender) {
        lyricsList.innerHTML = ''; 
        if (lyricsToRender.length === 0) {
            lyricsList.innerHTML = "<li>No lyrics found.</li>";
            return;
        }
        lyricsToRender.forEach(lyric => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <h3>${lyric.title} - ${lyric.artist}</h3>
                <p>${lyric.lyrics.substring(0, 50)}...</p>
            `;
            listItem.dataset.lyricId = lyric.id;
            lyricsList.appendChild(listItem);
        });
    }

    function filterLyrics(lyricsToFilter) {
        const query = searchInput.value.toLowerCase();
        const filteredLyrics = lyricsToFilter.filter(lyric => {
            return lyric.title.toLowerCase().includes(query) ||
                   lyric.artist.toLowerCase().includes(query);
        });
        renderLyrics(filteredLyrics);
    }

    function showFullLyrics(lyricId) {
        const lyric = allLyrics.find(l => l.id == lyricId);
        if (lyric) {
            currentLyricId = lyricId; // NEW: Store the ID of the current lyric
            fullLyricsTitle.textContent = lyric.title;
            fullLyricsArtist.textContent = lyric.artist;
            fullLyricsText.textContent = lyric.lyrics;
            mainContent.classList.add('hidden');
            fullLyricsView.classList.remove('hidden');
        }
    }

    function hideFullLyrics() {
        fullLyricsView.classList.add('hidden');
        mainContent.classList.remove('hidden');
        currentLyricId = null; // NEW: Clear the stored ID
    }

    // NEW: Function to handle deleting a lyric
    function deleteLyric() {
        if (currentLyricId && window.confirm("Are you sure you want to delete this lyric?")) {
            // Filter out the lyric to be deleted
            allLyrics = allLyrics.filter(lyric => lyric.id != currentLyricId);
            
            // Save the updated list to localStorage
            localStorage.setItem('allLyrics', JSON.stringify(allLyrics));
            
            // Go back to the main page to show the updated list
            window.location.href = 'delete.html';
        }
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function loadLyrics() {
        const storedLyrics = localStorage.getItem('allLyrics');
        if (storedLyrics) {
            allLyrics = JSON.parse(storedLyrics);
            let lyricsToRender = allLyrics;

            const selectedAlbum = getUrlParameter('album');
            if (selectedAlbum) {
                lyricsToRender = allLyrics.filter(lyric => lyric.album === selectedAlbum);
                mainTitle.textContent = selectedAlbum;
            } else {
                mainTitle.textContent = "ፐ-ዜማ: All Lyrics";
            }

            const sortedLyrics = sortLyricsFIFO(lyricsToRender);
            renderLyrics(sortedLyrics);
            searchInput.addEventListener('input', () => filterLyrics(lyricsToRender));

        } else {
            fetch('lyrics.json')
                .then(response => response.json())
                .then(fetchedLyrics => {
                    allLyrics = fetchedLyrics;
                    localStorage.setItem('allLyrics', JSON.stringify(allLyrics));
                    window.location.reload(); 
                })
                .catch(error => {
                    console.error("Could not load the lyrics:", error);
                    lyricsList.innerHTML = "<li>Failed to load lyrics. Please try again.</li>";
                });
        }
    }
    
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            loadLyrics();
        }, 500); 
    }, 2000);

    lyricsList.addEventListener('click', (event) => {
        const listItem = event.target.closest('li');
        if (listItem) {
            const lyricId = listItem.dataset.lyricId;
            showFullLyrics(lyricId);
        }
    });

    closeButton.addEventListener('click', hideFullLyrics);

    // NEW: Add event listener for the delete button
    deleteButton.addEventListener('click', deleteLyric);
});
