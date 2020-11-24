'use strict';

const apiKey = "Pa8VKI1Y6iAWdo6lPZGUhIfLN8xCxsMQePLB8ZFE";

const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.data.length & i<maxResults ; i++){
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    
    $('#results-list').append(
      `<li>
      <p>Name: ${responseJson.data[i].fullName}</p>
      <p>Park Description ${responseJson.data[i].description}</p>
      <h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getPark(query, maxResults=10) {
  query = query.split(",");
  let queryStr = "";
  for (let i = 0; i < query.length; i++){
    queryStr += `stateCode=${query[i].trim().toUpperCase()}&`
  }

  /*const params = {
    parkCode: query,
    api_key: apiKey
  };*/
  //const queryString = formatQueryParams(params)
  const url = `${searchURL}?${queryStr}api_key=${apiKey}`;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getPark(searchTerm, maxResults);
  });
}

$(watchForm);