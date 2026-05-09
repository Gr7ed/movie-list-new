
const apiKey = 'd6de65a5'; 
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieList = document.getElementById('movie-list');

// Only run search functionality if on index page
if (!searchInput || !searchButton || !movieList) {
  throw new Error('Required elements not found. Make sure this script runs on index.html');
}


searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        const movies = await getMovies(query);
        if (movies.length > 0 ) {
            renderMovies(movies);
        } else {
            movieList.innerHTML = '<p style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">Unable to find what you’re looking for. Please try another search.</p>';
        }
    }
});



async function getMovies(params) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&r=json&s=${params}`);
    const data = await response.json();
    if (!data.Search) return [];
    return await Promise.all(data.Search.map(movie => getMovieDetails(movie.imdbID)));
}

async function getMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&r=json&i=${imdbID}`);
    const movieDetails = await response.json();
    return movieDetails;
}

function renderMovies(movies) {
    let movieCards = '';
    movies.forEach(movie => {
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
                        <button class="watchlist-btn" data-imdbid="${movie.imdbID}">
                            <span class="plus-icon">+</span> Watchlist
                        </button>
                    </div>
                        <p class="description">
                        ${movie.Plot}
                        </p>
                </div>
            </div>
         `
    });
    movieList.innerHTML = movieCards;
    
    // Attach event listeners to all newly rendered Watchlist buttons
    const watchlistBtns = document.querySelectorAll('.watchlist-btn');
    watchlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const imdbID = e.currentTarget.dataset.imdbid;
            const movieToAdd = movies.find(m => m.imdbID === imdbID);
            addToWatchlist(movieToAdd);
        });
    });
}

function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const isAlreadyInWatchlist = watchlist.some(m => m.imdbID === movie.imdbID);
    
    if (!isAlreadyInWatchlist) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${movie.Title} added to your watchlist!`);
    } else {
        alert(`${movie.Title} is already in your watchlist.`);
    }
}
