
async function searchShows(query) {
  const response = await axios.get('http://api.tvmaze.com/search/shows', { params: {q: query } });
  const results = response.data;
  const showArr = [];

  for (let each of results){
    showArr.push(each.show)
  }

  for (let show of showArr) {
    if (!show.image) {
      show.image = { medium: "missing-image.png", original: "missing-image.png" };
    }
  }

  return showArr;
}

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
 let count = 0;
  for (let show of shows) {
    count ++;
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image.medium}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <form class="selectMe">
             <button type="submit" id="b${count}" class="btn btn-warning">Episodes!</button>
             </form>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
});

async function getEpisodes(id) {
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  const results = episodes.data;
  const epiArr = [];

  for (let each of results) {
    let { id, name, season, number } = each;
    epiArr.push({id, name, season, number});
  }

  return epiArr;
}



$("#shows-list").on('submit', '.selectMe', async function (e) {
  e.preventDefault();
  
  const { 0: {id} } = $(e.target).find('button');
  let btnID = `#${id}`;
  const showID = $(btnID).parent().parent().parent().data('showId');
  
  const episodes = await getEpisodes(showID);
  populateEpisodes(episodes);
})



async function populateEpisodes (data) {
  const $container = $('#episodes-area');
  $container.css('display', 'block').empty();
  
  for (let each of data){
    let episode = $(`
      <li class="list-group-item">Name: ${each.name}</li>
      <li class="list-group-item">Season: ${each.season}</li>
      <li class="list-group-item">Number: ${each.number}</li><br>
      `);
    $container.append(episode);
  }
}
