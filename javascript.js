////////////////////Updating the html////////////////

//////STEP 1: Create a basic html layout for the result to appear///////

//////STEP 2: Target the input area ///////

//////STEP 3: Forward the result to the API ///////

//////STEP 4: Storage the song title, artist and image with a variable ///////

//////STEP 5: Profit ///////

/*Search for the lyric provided in the input bar in the Genius Web API
From the result append the title, the artist and the imagine of the song which the lyric belong to
If no result, there will be an error message*/
function lyricSubmission() {
  event.preventDefault();

  //remove the previous error sign by targeting all p tag of input-section
  $("#input-section").children("p").remove();

  let lyricInput = $("#input-section-bar").val().trim();

  //This is the API config for the Genius API
  var settings = {
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

  //This function append the searched song title, song and image to the result container
  function printData(data) {
    //Setting Variable for data result
    console.log(data)
    let resultTitle = data.response.hits[0].result.title;
    let resultArtistName = data.response.hits[0].result.primary_artist.name;
    let resultImg = data.response.hits[0].result.header_image_thumbnail_url;
    
    let containerDiv = $("<div>").attr("class", "ui middle aligned stackable grid container")
    let imageRow = $("<div>").attr("class", "row segment")
    let textRow = $("<div>").attr("class", "eight wide column")
    let imagePositionDiv = $("<div>").attr("class", "two wide left column segment small")
    //Creating song title tag
    let songTitleTag = $("<h3>").text(resultTitle)
      .attr("id", "song-title")
      .attr("class", "ui header");

    //Creating dynamic tags for data
    let songArtistTag = $("<p>")
      .text(resultArtistName)
      .attr("id", "song-artist");

    let songImage = $("<img>")
      .attr("src", resultImg)
      .attr("alt", resultTitle + "image")
      
      .attr("id", "song-image");

    //Appending data to result container
    
    textRow.append(songTitleTag, songArtistTag);
    imagePositionDiv.append(songImage);
    imageRow.append(imagePositionDiv, textRow);
    containerDiv.append(imageRow);
    console.log(containerDiv)
    $("#result-container").append(containerDiv);
  }

  function errorFunction() {
    let warning = $("<p>").text("Please enter a valid lyric");
    warning.css("color", "red");
    $("#input-section").append(warning);
    console.log("error function")
  }

  $.ajax(settings).then(printData).catch(errorFunction);
}

$("#submit-btn").click(lyricSubmission);
