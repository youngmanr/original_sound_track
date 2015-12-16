$(document).ready(function() {

  var latitude;
  var longitude;
  var cityName;
  var country;
  var playlist = [];

  $('button').click(function() {
    getLocation();
  });

  function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition, function() { console.log("failed to get position") }, {timeout: 30000});
  };

  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    var geolocUrl = 'https://maps.googleapis.com/maps/api/geocode/json?&language=en&latlng=' + latitude + "," + longitude
                     '&key=AIzaSyAGWnWE0GeEPpCYmiy2mXZ9RnDGf_n3JQA';

    $.get(geolocUrl, function(response) {

      var results = response.results
      if (results[results.length-1].address_components[0].long_name === 'United Kingdom') {
        for (var result = 0; result < results.length; result++) {
          for (var component = 0; component < results[result].address_components.length; component++) {
            if(results[result].address_components[component].types.includes('postal_town')) {
              cityName = convToParam(results[result].address_components[component].long_name);
            };
            if (results[result].address_components[component].types.includes('administrative_area_level_1')) {
              country = convToParam(results[result].address_components[component].long_name);
            };
          };
        };
      } else {
        for (var result = 0; result < results.length; result++) {
          for (var component = 0; component < results[result].address_components.length; component++) {
            if(results[result].address_components[component].types.includes('locality')) {
              cityName = results[result].address_components[component].long_name;
            };
          };
        };
        country = results[results.length-1].address_components[0].long_name;
      };

      console.log("cityName = " + cityName, "country = " + country);
      console.log(response);
      getArtists();
    });
  };

  // ALTERNATIVE GEOLOCATION - a lot easier
  // $.get("http://ipinfo.io", function(response) {
  //   console.log(response.city, response.country, response.region);
  // }, "jsonp");

  function getArtists() {
    var echonestUrl = 'http://developer.echonest.com/api/v4/artist/search?api_key=BG6IJZJJYOKNETBX8' +
                  '&format=json' +
                  // '&artist_location=' + convToParam(cityName) + "+" + convToParam(country) +
                  '&artist_location=' + cityName + '+' + country +
                  '&min_familiarity=0.1' +
                  '&sort=familiarity-desc&results=35' +
                  '&bucket=artist_location' +
                  '&bucket=songs' + '&bucket=id:spotify';

    $.getJSON(echonestUrl,
        function(data){
        // data is JSON response object
        var spotifyID;
        var topTracks;
        var randomTrack;

        console.log(data.response);
        artist = data.response.artists[Math.floor(Math.random() * data.response.artists.length)];
        song = artist.songs[Math.floor(Math.random() * artist.songs.length)]
        console.log("artist object", artist);
        console.log("song object", song);
        $("#results").append("Randomly selected artist: "+artist.name+"<br/>" +
                             "Randomly selected song: " + song.title + "<br/>" +
                             "-------------------------------------------------- <br/>");

        spotifyID = spotifyArtistId(artist);
        playlist.push({artist: artist.name, spotifyID: spotifyID});
        getArtistTopTracks(playlist[0]);
    });
  };

  function getArtistTopTracks(artist) {
    var spotifyID = artist.spotifyID;
    var topTracksUrl = "https://api.spotify.com/v1/artists/" + spotifyID + "/top-tracks?country=GB";

    $.get(topTracksUrl, function(response) {
      artist.topTracks = response.tracks;
      artist.randomTrack = selectArtistRandomTrack(artist.topTracks);
      console.log( "preview URL:", artist.randomTrack.preview_url);
    });
  }

  function selectArtistRandomTrack(topTracks) {
    return topTracks[Math.floor(Math.random() * topTracks.length)];
  }

  function spotifyArtistId(artist) {
    var foreignId = artist.foreign_ids[0].foreign_id

    return foreignId.slice(15);
  }


  // CONVERTS MULTI WORD STRINGS INTO PARAMS e.g. 'Brighton and Hove' => 'Brighton+and+Hove'
  function convToParam(words) {
    var result = words.split(" ");
    result = result.join("+");
    return result;
  }

});

