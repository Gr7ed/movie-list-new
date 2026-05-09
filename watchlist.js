const watchlistContainer = document.getElementById('watchlist-container');

// Only run watchlist functionality if on watchlist page
if (!watchlistContainer) {
  throw new Error('Watchlist container not found. Make sure this script runs on watchlist.html');
}

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    
    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">Your watchlist is looking a little empty...</p>';
        return;
    }

    let movieCards = '';
    watchlist.forEach(movie => {
        movieCards += ` 
           <div class="movie-card">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" class="poster">
                <div class="movie-info">
                    <div class="title-row">
                        <h1>${movie.Title}</h1>
                        <span class="rating">⭐ ${movie.imdbRating}</span>
                    </div>
                    <div class="meta-row">
                        <span>${movie.Runtime}</span>
                        <span>${movie.Genre}</span>
                        <button class="watchlist-btn remove-btn" data-imdbid="${movie.imdbID}">
                            <span class="plus-icon">-</span> Remove
                        </button>
                    </div>
                    <p class="description">
                        ${movie.Plot}
                    </p>
                </div>
            </div>
         `;
    });
    watchlistContainer.innerHTML = movieCards;

    // Attach event listeners to remove buttons
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const imdbID = e.currentTarget.dataset.imdbid;
            const updatedWatchlist = watchlist.filter(m => m.imdbID !== imdbID);
            localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
            renderWatchlist(); // Re-render the list after removing an item
        });
    });
}

renderWatchlist();
