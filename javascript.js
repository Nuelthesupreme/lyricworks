////////////////////Updating the html////////////////

//////STEP 1: Create a basic html layout for the result to appear///////

//////STEP 2: Target the input area ///////

//////STEP 3: Forward the result to the API ///////

//////STEP 4: Storage the song title, artist and image with a variable ///////

//////STEP 5: Profit ///////

function lyricSubmission() {
  event.preventDefault();
  $("#input-section").children("p").remove();

  let lyricInput = $("#input-section-bar").val().trim();

  //This is the API config for the Genius API
  var settings = {
    async: true,
    crossDomain: true,
    url: "https://genius.p.rapidapi.com/search?q=" + lyricInput,
    method: "GET",
    headers: {
      "x-rapidapi-host": "genius.p.rapidapi.com",
      "x-rapidapi-key": "4c41606b11mshd75147a6a3e6b95p17577fjsnddd0bfa707d3",
    },
  };

  //This function append the searched song title, song and image to the result container
  function printData(data) {
    let resultTitle = data.response.hits[0].result.title;
    let resultArtistName = data.response.hits[0].result.primary_artist.name;
    let resultImg = data.response.hits[0].result.header_image_thumbnail_url;
    let songTitleTag = $("<h2>").text(resultTitle).attr("id", "song-title");

    let songArtistTag = $("<p>")
      .text(resultArtistName)
      .attr("id", "song-artist");

    let songImage = $("<img>")
      .attr("src", resultImg)
      .attr("alt", resultTitle + "image")
      .attr("id", "song-image");

    $("#result-container").append(songTitleTag, songArtistTag, songImage);
  }

  function errorFunction() {
    let warning = $("<p>").text("WTF are you doing");
    warning.css("color", "red");
    $("#input-section").append(warning);
  }

  $.ajax(settings).then(printData).catch(errorFunction);
}

$("#submit-btn").click(lyricSubmission);
