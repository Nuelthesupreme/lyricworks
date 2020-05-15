////////////////////Updating the html////////////////

//STEP 1: Create a basic html layout for the result to appear

//STEP 2: Target the input area

//STEP 3: Forward the result to the API

//STEP 4: Storage the song title, artist and image with a variable

//STEP 5: Test and Amend

/*Search for the lyric provided in the input bar in the Genius Web API
From the result append the title, the artist and the imagine of the song which the lyric belong to
If no result, there will be an error message*/

function errorFunction() {
  const warning = $("<p>")
    .addClass("ui red header")
    .text("Please enter a valid lyric");
  //  change header to a smaller text find in semantic ui
  $("#input-section").append(warning);
}

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

    function youtubeProblem(data) {
      console.log("youtube API error");
    }

    $.ajax(settingsYoutube).then(printYoutube).catch(youtubeProblem);
  }

  //This function append the searched song title, song and image to the result container
  function printData(data) {
    //Setting Variable for data result
    const hits = data.response.hits;
    if (hits.length !== 0) {
      let count = 5;

      if (hits.length < 5) {
        count = hits.length;
      }
      $("#result-container").empty();
      for (let i = 0; i < count; i++) {
        renderResultImage(hits[i]);
      }
    } else {
      const warning = $("<p>")
        .addClass("ui red header")
        .text("Please enter a valid lyric");
      //  change header to a smaller text find in semantic ui
      $("#input-section").append(warning);
    }
  }

  $.ajax(settings).then(printData).catch(errorFunction);
}

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
$('.info.icon')
      .popup({
        on: 'hover'
      });
    // $('input')
    //   .popup({
    //     on: 'focus'
    //   });
