////////////////////Updating the html////////////////

//STEP 1: Create a basic html layout for the result to appear

//STEP 2: Target the input area

//STEP 3: Forward the result to the API

//STEP 4: Storage the song title, artist and image with a variable

//STEP 5: Test and Amend

/*Search for the lyric provided in the input bar in the Genius Web API
From the result append the title, the artist and the imagine of the song which the lyric belong to
If no result, there will be an error message*/

//this was the function that handled the error messaging when Genius failed to return it's promise from ajax
function errorFunction() {
  const warning = $("<p>")
    .addClass("ui red header")
    .text("Please enter a valid lyric");
  //  change header to a smaller text find in semantic ui
  $("#input-section").append(warning);
}
//this overriding function uses the information pulled from the user input to send the information needed to the Genius api, as the initial function it also handles the changing of the initial page and defaults the page when necessary
function lyricSubmission() {
  event.preventDefault();
  $("#spacing").remove();
  $("#input-section").children("p").remove();

  let lyricInput = $("#input-section-bar").val().trim();
  lastSearchedLyric = lyricInput;

  //This is the API config for the Genius API
  const settings = {
    async: true,
    //CROS enabler
    crossDomain: true,
    url: "https://genius.p.rapidapi.com/search?q=" + lyricInput,
    method: "GET",
    //Targeting Genius within RapidApi
    headers: {
      "x-rapidapi-host": "genius.p.rapidapi.com",
      "x-rapidapi-key": "4c41606b11mshd75147a6a3e6b95p17577fjsnddd0bfa707d3",
    },
  };

  //this function renders all the necessary information returned from the Genius api dynamically into the results page
  function renderResultImage(data) {
    const resultTitle = data.result.title;
    const resultArtistName = data.result.primary_artist.name;
    const resultImg = data.result.header_image_thumbnail_url;
    const containerDiv = $("<figure>").addClass(
      "ui middle aligned stackable grid container resultBox hvr-bounce-to-right"
    );
    const imageRow = $("<section>").addClass("row segment");
    const textRow = $("<article>").addClass("eight wide column");
    const imagePositionDiv = $("<figure>").addClass(
      "two wide left column segment small"
    );

    //Creating song title tag
    const songTitleTag = $("<h3>")
      .text(resultTitle)
      .attr("id", "song-title")
      .addClass("ui header");

    //Creating dynamic tags for data
    const songArtistTag = $("<p>")
      .text(resultArtistName)
      .attr("id", "song-artist");

    const songImage = $("<img>")
      .attr("src", resultImg)
      .attr("alt", resultTitle + " image")
      .attr("id", "song-image");

    //Appending data to result container

    textRow.append(songTitleTag, songArtistTag);
    imagePositionDiv.append(songImage);
    imageRow.append(imagePositionDiv, textRow);
    containerDiv.append(imageRow);

    $("#result-container").append(containerDiv);

    renderYoutubePlayer(resultTitle + " " + resultArtistName, imageRow);
  }
  //this is the overriding function to pull the information from the YouTube api and render it into the respective results above
  function renderYoutubePlayer(queryString, imageRow) {
    const settingsYoutube = {
      async: true,
      crossDomain: true,
      url: "https://www.googleapis.com/youtube/v3/search",
      method: "GET",

      data: {
        key: "AIzaSyCPMGypoq_TUL0nkKuCsz6ECBIg0PMnLNk",
        q: queryString,
        part: "snippet",
        maxResults: 1,
        type: "video",
        videoEmbeddable: true,
      },
    };
    //this function uses the data received from the YouTube api to create a video within each returned result from above
    function printYoutube(dataYoutube) {
      const youtubeVideoId = dataYoutube.items[0].id.videoId;
      const youtubeVideoUrl = "https://www.youtube.com/embed/" + youtubeVideoId;
      const youtubeiframe = $("<iframe>")
        .attr("src", youtubeVideoUrl)
        .attr("frameborder", "0")
        .attr(
          "allow",
          "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        );

      imageRow.append(youtubeiframe);
    }
    //this function creates an error message for the user if there is an error with the Youtube api
    function youtubeProblem(data) {
      const warning = $("<p>")
        .addClass("ui red header")
        .text("We are currently experiencing an issue with YouTube");

      $("#input-section").append(warning);
    }

    $.ajax(settingsYoutube).then(printYoutube).catch(youtubeProblem);
  }
  //This function handles the conditioning of how we append the results, whether it's an error or not by calling it's respective functions
  function printData(data) {
    //Setting Variable for data result to make sure that there is information in the object returned
    const hits = data.response.hits;
    if (hits.length !== 0) {
      let count = 5;
      //making sure that no results is repeated/empty results
      if (hits.length < 5) {
        count = hits.length;
      }
      //makes sure that results page is empty before repopulating
      $("#result-container").empty();

      //For each array (the top 5) we want to render the results on the page, if unsuccessful then pop up error message
      for (let i = 0; i < count; i++) {
        renderResultImage(hits[i]);
      }
    } else {
      const warning = $("<p>")
        .addClass("ui red header")
        .text("Please enter a valid lyric");

      $("#input-section").append(warning);
    }
  }
  $.ajax(settings).then(printData).catch(errorFunction);
}
$(".info.icon").popup({
  on: "hover",
});
//lastSearchedLyric is the variable for last lyric entered to search bar. USer cannot search a lyric identity with lastSearchedLyric
var lastSearchedLyric;
$("#submit-btn").click(function (e) {
  if ($("#input-section-bar").val().trim() !== lastSearchedLyric) {
    lyricSubmission();
  }
});
$("#input-section-bar").keypress(function (e) {
  if (
    (e.which == 13) &
    ($("#input-section-bar").val().trim() !== lastSearchedLyric)
  ) {
    lyricSubmission();
  }
});
