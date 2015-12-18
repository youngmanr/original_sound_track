$(document).ready(function() {

  var positionData;
  var playing = false;

  // $('#load-track').click(function() {
  //   getLocation();
  // });

  function getLocation() { // Nb. Error handling has been removed
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        resolve([latitude, longitude]);
      });
    });
  };

  function showPosition() {

    return new Promise(function(resolve, reject) {
      getLocation().then(function(position) {

        console.log('THE FIRST PROMISE: ' + position);

        var latitude = position[0]
        var longitude = position[1]
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

          // console.log("cityName = " + cityName, "country = " + country, "countryCode = " + countryCode);
          // console.log(response);

          resolve([cityName, country, countryCode]);

        });
      });
    });
  };


  // MAKES ECHONEST API CALL BASED ON cityName AND country
  function getArtists(positionData) {
    return new Promise(function(resolve, reject) {
      var cityName = positionData[0];
      var country = positionData[1];
      var echonestUrl = 'http://developer.echonest.com/api/v4/artist/search?api_key=BG6IJZJJYOKNETBX8' +
                    '&format=json' +
                    '&artist_location=' + cityName + '+' + country +
                    '&min_familiarity=0.1' +
                    '&sort=familiarity-desc&results=35' +
                    '&bucket=id:spotify';

      $.get(echonestUrl, function(data){
        resolve(data);
      });
    });
  };



  // MAKES SPOTIFY API CALL BASED ON THE ARTIST ID AND SETS PROPERTY topTracks AND A randomTrack
  // THIS SHOULD BE REFRACTORED INTO TWO METHODS: 1) getTopTracksForAllArtists 2) addTracksToPlaylist
  // IF POSSIBLE playIfNotPlaying SHOULD BE CALLED FROM OUTSIDE OF THIS FUNCTION
  // function getArtistTopTracks(artist) {
  function getArtistTopTracks(artistsObject, positionData) {
    return new Promise(function(resolve, reject) {
    artistsObject.response.artists.forEach(function(artist) {
        var spotifyId = spotifyArtistId(artist);
        var countryCode = positionData[2];
        var topTracksUrl = "https://api.spotify.com/v1/artists/" + spotifyId + "/top-tracks?country=" + countryCode;

        $.get(topTracksUrl, function(response){
          response.tracks.forEach(function(song) {
            myPlaylist.add({
              title: song.name,
              artist: song.artists[0].name,
              mp3: song.preview_url
            });
          playIfNotPlaying();
          });
        });
      });
      resolve('No data to return');
    });
  }

  // PLAY THE PLAYLIST IF IT'S NOT ALREADY PLAYING
  function playIfNotPlaying(){
    if (!playing) {
      playing = true;
      myPlaylist.play(0);
    };
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

  function getEvent(latitude, longitude) {
    var eventUrl = 'http://api.songkick.com/api/3.0/search/locations.json?location=geo:'+
      latitude + ',' + longitude +
      '&apikey=qMMmyACVKOgL3Kgb';
    $.getJSON(eventUrl, function(data){
        var metroAreaID = data.resultsPage.results.location[0].metroArea.id;
        upcomingEvents(metroAreaID);
    });
  };

  function upcomingEvents(metroAreaID) {
    var eventUrl = 'http://api.songkick.com/api/3.0/metro_areas/' +
    metroAreaID +
    '/calendar.json?apikey=qMMmyACVKOgL3Kgb';

    $.getJSON(eventUrl, function(data){
      $.each(data.resultsPage.results.event, function (i, event) {
        var displayName = event.displayName;
        $("#event").append("<li>"+displayName+"</li>");
      });
    });
  };

  // CALLING THE FUNCTIONS IN A CHAIN
  showPosition().then(function(positionPromise) {
    positionData = positionPromise;
    console.log('THE SECOND PROMISE: ' + positionData);
    getArtists(positionData).then(function(artistsObjectPromise) {
      console.log('THE THIRD PROMISE: (see object below)');
      console.log(artistsObjectPromise);
      getArtistTopTracks(artistsObjectPromise, positionData).then(function(topTracksPromise) {
        console.log('THE FOURTH PROMISE: ' + topTracksPromise);
      });
    });
  });
});