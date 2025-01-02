const parentElement = document.querySelector(".main");
const searchInput = document.querySelector(".input");
const movieRatings = document.querySelector("#rating-select");
const movieGenres = document.querySelector("#genre-select");

let searchValue="";
let ratings = 0;
let genre = "";
let filteredArrOfMovies = [];

const URL = "http://www.omdbapi.com/?i=tt3896198&apikey=51f39896";

/* Fethcing data from the API using axios , async &  await */

const getMovies = async (url) => {
  try {
    const {data} = await axios.get(url);
    return data;
  } catch (err) {}
};

let movie = await getMovies(URL);
console.log(movie);


/* We can also fetch the data using fetch api also, but we need to convert the fetched data into json while axios does it automatically */

// fetch(URL)
//     .then(response => response.json())
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));


const createElement = (element) =>  document.createElement(element) ;

const createMovieCard = (movie) => {

   //creating parent container
   const cardContainer = createElement("div");
   cardContainer.classList.add("add" , "shadow","card");

   //creating image container
   const imagecontainer = createElement("div");
   imagecontainer.classList.add("card-image-container");

   //creating card image
   const imageEle = createElement("img");
   imageEle.classList.add("card-image");
   imageEle.setAttribute("src",movie.Poster);
   imageEle.setAttribute("alt",movie.name);

   //appending the image
   imagecontainer.appendChild(imageEle);

   //appending the card container or adding the image conatiner to card container
   cardContainer.appendChild(imagecontainer);

   // creating card details container
   const cardDetails = createElement("div");
   cardDetails.classList.add("movie-details");

   //movie card title
   const titleEle = createElement("p");
   titleEle.classList.add("title");
   titleEle.innerText = movie.Title;
   cardDetails.appendChild(titleEle);
   
   //card genre
   const genreEle = createElement("p");
   genreEle.classList.add("genre");
   genreEle.innerText = `Genre : ${movie.Genre}`;
   cardDetails.appendChild(genreEle);

   //ratings and length container
   const movieRating = createElement("div");
   movieRating.classList.add("ratings");

   // star/rating component
   const ratings = createElement("div");
   ratings.classList.add("star-rating");

   //star icon
   const starIcon = createElement("span");
   starIcon.classList.add("material-icons-outlined");
   starIcon.innerText = "star";
   ratings.appendChild(starIcon);

   // ratings

   const ratingValue = createElement("span");
   ratingValue.innerText = movie.imdbRating;
   ratings.appendChild(ratingValue);

   //length
   const length = createElement("p");
   length.innerText = movie.Runtime;

   movieRating.appendChild(length);
   movieRating.appendChild(ratings);
   cardDetails.appendChild(movieRating);
   cardContainer.appendChild(cardDetails);
   
   parentElement.appendChild(cardContainer);
};


function getfilteredData(){
  //console.log(event.target.value);
  filteredArrOfMovies = 
    searchValue?.length > 0 ? 
      movie.filter(movie => searchValue === movie.Title.toLowerCase() || 
      searchValue === movie.director_name.toLowerCase() ||
      movie.write_name.toLowerCase().split(",").includes(searchValue) ||
      movie.cast_name.toLowerCase().split(",").includes(searchValue)
      ) : movies ;
    
    if(ratings > 0){
      filteredArrOfMovies = searchValue?.length > 0 ? filteredArrOfMovies : movies ;
      filteredArrOfMovies = filteredArrOfMovies.filter(movie => movies.imdb_rating >= ratings)
    } 
    
    if(genre?.length>0){
      filteredArrOfMovies = searchValue?.length > 0 || ratings > 7 ? filteredArrOfMovies : movies;
      filteredArrOfMovies = filteredArrOfMovies.filter((movie) => movie.genre.includes(genre));
    }
    return filteredArrOfMovies;
}

function handleSearch(event){
  searchValue = event.target.value.toLowerCase();
  console.log(searchValue);
  let filterBySearch = getfilteredData()
  parentElement.innerHTML = "";
  createMovieCard(filterBySearch);
}

// debouncing is certain time delay which enable to display the movies only when typing is completede in searchbox
function debounce(callback, delay){
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {callback(...args)}, delay); 
  }
}

function handleRatingSelector(event){
  ratings = event.target.value;
  let filterByRating = getfilteredData();
  parentElement.innerHTML = "";
  createMovieCard(ratings ? filterByRating : movie);
}

const debounceInput = debounce(handleSearch, 500);

searchInput.addEventListener("keyup",debounceInput);

movieRatings.addEventListener("change",handleRatingSelector);

//Filter by Genre

const genres = movies.reduce((acc, cur) => {
  let genresArr = [];
  let tempGenresArr = cur.genre.split(",");
  acc = [...acc, ...tempGenresArr];
  for(let genre of acc) {
    if(!genresArr.includes(genre)){
      genresArr = [...genresArr, genre];
    }
  }
  return genresArr;
}, []);

for (let genre of genres){
  const option = createElement("option");
  option.classList.add("option");
  option.setAttribute("value", genre);
  option.innerText = genre;
  movieGenres.appendChild(option); 
}
 
function handleGenreSelect(event){
 genre = EventTarget.target.value;
 const filteredMoviesByGenre = getfilteredData();
 parentElement.innerHTML = "";
 createMovieCard(genre ? filteredArrOfMovies : movie)
}


movieGenres.addEventListener("change", handleGenreSelect);

createMovieCard(movie);

