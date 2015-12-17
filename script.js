$(document).ready(function() {

  var cityName;
  var country;
  var countryCode;
  var playlist = [];
  var trackUrl;

  $('#load-track').click(function() {
    $.when(getLocation()).done( function() { console.log(playlist) } );
  });

  function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition, function() { console.log("failed to get position") }, {timeout: 30000});
  };

  //
  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
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
              cityName = convToParam(results[result].address_components[component].long_name);
            };
          };
        };
        country = convToParam(results[results.length-1].address_components[0].long_name);
      };

      countryCode = results[results.length-1].address_components[0].short_name;
      console.log("cityName = " + cityName, "country = " + country, "countryCode = " + countryCode);
      console.log(response);
      getArtists();
    });
  };

  // MAKES ECHONEST API CALL BASED ON cityName AND country
  function getArtists() {
    var echonestUrl = 'http://developer.echonest.com/api/v4/artist/search?api_key=BG6IJZJJYOKNETBX8' +
                  '&format=json' +
                  '&artist_location=' + cityName + '+' + country +
                  '&min_familiarity=0.1' +
                  '&sort=familiarity-desc&results=35' +
                  '&bucket=id:spotify';

    $.get(echonestUrl, function(data){
      data.response.artists.forEach(function(artist) {
        getArtistTopTracks(artist);
      });
      console.log(playlist);
    });
  };



  // MAKES SPOTIFY API CALL BASED ON THE ARTIST ID AND SETS PROPERTY topTracks AND A randomTrack
  function getArtistTopTracks(artist) {
    var spotifyId = spotifyArtistId(artist);
    var topTracksUrl = "https://api.spotify.com/v1/artists/" + spotifyId + "/top-tracks?country=" + countryCode;

    $.get(topTracksUrl, function(response) {
      response.tracks.forEach(function(song) {

        myPlaylist.add({
          title: song.name,
          artist: song.artist[0].name,
          mp3: song.preview_url
        });

      });
      playerFunction();
    });
  }

  // PICKS OUT THE ARTIST ID FROM THE URI
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