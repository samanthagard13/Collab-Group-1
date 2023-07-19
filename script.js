var citySearchEl = $('#citySearchText');
var movieSearchEl = $('#movieSearchText');
var cityInput = citySearchEl.val();
var movieInput = movieSearchEl.val();
var buttons = [];
var para = document.createElement('p');


$(document).ready(function() {

// OMDB API Key: d9732be9
// OMDB Data Requests:  http://www.omdbapi.com/?apikey=[yourkey]&
// OMDB Poster Requests:  http://img.omdbapi.com/?apikey=[yourkey]&

// SERP API Key: 7c6118fdb3f3089d85b5fb869874edfac11e803bd3520e4f5d117c1a8a2e641e
//SERP API Example
// https://serpapi.com/search.json?engine=google&q=Coffee
// params = {
//     engine: "google",
//     q: "Coffee",
//     api_key: "7c6118fdb3f3089d85b5fb869874edfac11e803bd3520e4f5d117c1a8a2e641e"
//   }
  
//   search = GoogleSearch.new(params)
//   organic_results = search.get_hash[:organic_results]

// Default Poster fetch request API call using SerpAPI 

function getNowPlayingMovies() {
    var nowPlayingURL = 'https://api.themoviedb.org/3/movie/now_playing?api_key=3d41be2de60c62ec063c22571cdc0634';
    var apiKey = '3d41be2de60c62ec063c22571cdc0634';

    fetch (nowPlayingURL, {
        headers: {
            'Authorization': 'Bearer ' + apiKey,
            'accept': 'application/json'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        processMovieData(data);
    })
    .catch(function(error) {
        console.error('Error fecthing now playing movies', error);
    });
};

function processMovieData(data) {
    var movieContainer = document.getElementById('movieContainer');
        
        for (var i = 0; i < 5; i++) {
            var movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            var movieImage = document.createElement('img');
            movieImage.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + data.results[i].poster_path);
            movieCard.appendChild(movieImage);

            var movieName = document.createElement('h2');
            movieName.textContent = data.results[i].title;
            movieCard.appendChild(movieName);

            var extension = document.createElement('p');
            extension.textContent = 'Rating:' + data.results[i].vote_average;
            movieCard.appendChild(extension);

            movieContainer.appendChild(movieCard);
        }
      };

// JS Section to initialize form submittal and drive search function to variable storage.

var searchSubmit = function (event) {
    event.preventDefault();

    var cityInput = citySearchEl.val();
    var movieInput = movieSearchEl.val();
    currentCityEl.text(cityInput);
    currentMovieEl.text(movieInput);
    // Add dynamic button creation with each search with btn functionality to be searched
    var savedButton = document.createElement('button');
    savedButton.textContent = movieInput + " - " + cityInput;

    //Reloads input text
    savedButton.addEventListener('click', function() {
        document.getElementById('citySearchText').value = cityInput;
        document.getElementById('movieSearchText').value = movieInput;
    });

    //Saves buttons to array
    buttons.push(cityInput, movieInput);
    saveButtonsToLocalStorage();

    document.getElementById('history').appendChild(savedButton);
    document.getElementById('history').appendChild(para);
    
    theaterTimes(cityInput, movieInput); //replace this line with search API function from the next section
};

function loadButtonsFromLocalStorage() {
    var savedButtons = localStorage.getItem('buttons');

    if (savedButtons) {
        buttons = JSON.parse(savedButtons);
        buttons.forEach(function(buttonText) {
            var button = document.createElement('button');
            button.textContent = buttonText;
            button.classList.add('history-button');
            button.addEventListener('click', function() {
                var buttonText = this.textContent;
                getApi(buttonText); //replace this with search API function from next section
            });
            var para = document.createElement('p');
            para.appendChild(button);
            document.getElementById('history').appendChild(para);
        });
    }
};

function saveButtonsToLocalStorage (){
    localStorage.setItem('buttons', JSON.stringify(buttons));
};

function theaterTimes() {
    var theaterTimesUrl = `https://serpapi.com/search.json?q=eternals+theater&location=${cityInput}+United+States&movie+name=${movieInput}&hl=en&gl=us&api_key=7c6118fdb3f3089d85b5fb869874edfac11e803bd3520e4f5d117c1a8a2e641e`;
    var theaterContainer = $('#search-results');

    fetch(theaterTimesUrl) 
        if (response.ok) {
            response.json().then(function(data) {
                var results = document.createElement('div');
                results.textContent = data.showtimes
                theaterContainer.append(results);
            });
        };
};

document.querySelector('form').addEventListener('submit', searchSubmit);

getNowPlayingMovies();
loadButtonsFromLocalStorage();

});


// Need JS Section to fetch request to grab location and movie name from variable store to search in SerpAPI for theaters near me for Card2.

// Need JS section to then fetch the showtimes for the theater searched in the above section (also address/map if possible and time permits).

// Need JS section for fetch request to grab movie plot (and any other info) to override default posters in Card1.
