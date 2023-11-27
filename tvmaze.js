"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  const search = await axios.get('http://api.tvmaze.com/search/shows', {params:
  {
    q: term
  }})
  // console.log(search.data);
  return search.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  if(shows.length <= 0){
    // console.log("AAAA");
    $showsList.html("No results found.");
  }

  for (let show of shows) {

    let imageUrl = show.show.image && show.show.image.original ? show.show.image.original : 'https://tinyurl.com/tv-missing';

    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${imageUrl}"
              alt="${show.show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();

  const $episodeButtons = $(".Show-getEpisodes");
  // console.log($episodeButtons);
  // console.log("AAAAAA");

  $episodeButtons.on("click", async function(e){
    e.preventDefault();
    // console.log(this.parentElement.parentElement.parentElement.getAttribute("data-show-id"));
    getEpisodesOfShow(this.parentElement.parentElement.parentElement.getAttribute("data-show-id"))
  })
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  // console.log(id);
  const showId = document.querySelector(`div[data-show-id="${id}"]`).getAttribute("data-show-id");
  const newEpi = document.querySelector(`div[data-show-id="${id}"]`);

  const getEpisodes = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);
  console.log(getEpisodes.data)
  console.log(newEpi);
  populateEpisodes(getEpisodes.data, newEpi);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes, newEpi) {
  for (let episode of episodes) {
    const episodeHtml = `
      <div data-episode-id="${episode.id}" class="episode col-md-12 col-lg-6 mb-4">
        <div class="media-body">
          <h5 class="text-primary">${episode.name}</h5>
          <div><small>${episode.summary}</small></div>
        </div>
      </div>
    `;
    const newEpi2 = document.createElement('div');
    newEpi2.innerHTML = episodeHtml
    newEpi.append(newEpi2);
  }
}


