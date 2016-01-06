$(document).ready(function() {

  var positionData = {};
  var playing = false;
  var artistInfoDisplayed = false;
  var modifiedCountries = ["United Kingdom"]

  $("#familiarityLow").click(function() {
    updateFamiliarity("0.1");
  });

  $("#familiarityMedium").click(function() {
    updateFamiliarity("0.5");
  });

  $("#familiarityHigh").click(function() {
    updateFamiliarity("0.9");
  });

  $('#familiarityMedium').prop('checked', true);

  function updateFamiliarity(f) {
    myPlaylist.remove();
    artistInfoDisplayed = false;
    getArtists(positionData, f).then(function(artistsObjectPromise) {
      console.log('Updated Familiarity Artists: (see object below)');
      console.log(artistsObjectPromise);
      getArtistTopTracks(artistsObjectPromise, positionData).then(function(topTracksPromise) {
        console.log("Update MyPlaylist (see below)");
        console.log(myPlaylist);
        myPlaylist.play();
      });
    });
  };

  function getLocation() { // Nb. Error handling has been removed
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(function(position) {
        positionData.latitude = position.coords.latitude;
        positionData.longitude = position.coords.longitude;
        resolve(position);
      });
    });
  };

  function searchLocation() {
    return new Promise(function(resolve, reject) {
      var geocoder = new google.maps.Geocoder();
      var searchTerms = $('#searchVal').val();
      geocoder.geocode( { 'address': searchTerms}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log('searchLocation Result---------' ,results);
            positionData.latitude = results[0].geometry.location.lat();
            positionData.longitude = results[0].geometry.location.lng();
            resolve(positionData);
          } else {
          alert("Geocode was not successful for the following reason: " + status);
        };
      });
    });
  };

  function showPosition() {
    return new Promise(function(resolve, reject) {

        var latitude = positionData.latitude;
        var longitude = positionData.longitude;
        var geolocUrl = 'https://maps.googleapis.com/maps/api/geocode/json?&language=en&latlng=' + latitude + "," + longitude
                         '&key=AIzaSyAGWnWE0GeEPpCYmiy2mXZ9RnDGf_n3JQA';

        $.get(geolocUrl, function(response) {
          var results = response.results
          var country = results[results.length-1].address_components[0].long_name;
          if (country === "United Kingdom") {
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

          positionData.cityName = cityName;
          positionData.country = country;
          positionData.countryCode = countryCode;
          positionData.latitude = latitude;
          positionData.longitude = longitude;
          resolve(positionData)
        });
    });
  };


  // MAKES ECHONEST API CALL BASED ON cityName AND country
  function getArtists(positionData, familiarity) {
    return new Promise(function(resolve, reject) {
      var familiarityTerm = familiarity || '0.5';
  //    var genreTerm = genre || '*';
      var cityName = positionData.cityName;
      var country = positionData.country;
      var echonestUrl = 'https://developer.echonest.com/api/v4/artist/search?api_key=BG6IJZJJYOKNETBX8' +
                    '&format=json' +
                    '&artist_location=' + cityName + '+' + country +
                    '&max_familiarity=' + familiarityTerm +
                    //'&description=' + genreTerm +
                    '&sort=familiarity-desc&results=35' +
                    '&bucket=id:spotify' +
                    '&bucket=biographies' +
                    '&bucket=artist_location' +
                    '&bucket=news';

      console.log('echonestURL ', echonestUrl)
  // https://developer.echonest.com/api/v4/artist/search?api_key=BG6IJZJJYOKNETB…=classical&sort=familiarity-desc&results=35&bucket=id:spotify&bucket=genre
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
        var countryCode = positionData.countryCode;
        var topTracksUrl = "https://api.spotify.com/v1/artists/" + spotifyId + "/top-tracks?country=" + countryCode;

        $.get(topTracksUrl, function(response){
          if(response.tracks.length > 0) {
            var randomNum = Math.floor(Math.random() * response.tracks.length);
            var randomTrack = response.tracks[randomNum];
            var title = randomTrack.name;
            var artistName = randomTrack.artists[0].name;
            var mp3 =randomTrack.preview_url;
            var poster = randomTrack.album.images[0].url;
            var bio = findBestBio(artist.biographies);
            var news = artist.news;

            myPlaylist.add({ title: title, artist: artistName, mp3: mp3, poster: poster, bio: bio, news: news });
            // playIfNotPlaying();
            displayArtistInfoIfNotAlreadyDisplayed(artistName, title, poster, bio, news);
          };
        });
      });
      resolve('No data to return');
    });
  }

  function findBestBio(biographies) {
    var result;
    biographies.forEach(function(i) {
      if(i.truncated !== true) {
        result = i;
      };
    });
    if(result) {
      return result
    } else {
      return {text: "No biography available"}
    };
  };

  // PLAY THE PLAYLIST IF IT'S NOT ALREADY PLAYING
  function playIfNotPlaying(){
    if (!playing) {
      playing = true;
      myPlaylist.play(0);
    };
  }

  function displayArtistInfoIfNotAlreadyDisplayed(artist, title, poster, bio, news){
    if (!artistInfoDisplayed) {
      artistInfoDisplayed = true;
      displayCurrentArtist(document, artist, title, poster, bio, news);
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

  function getSongKickMetroID(positionData) {
    return new Promise(function(resolve, reject) {
      var eventUrl = 'https://api.songkick.com/api/3.0/search/locations.json?location=geo:'+
        positionData.latitude + ',' + positionData.longitude +
        '&apikey=qMMmyACVKOgL3Kgb' + '&jsoncallback=?';
      $.getJSON(eventUrl, function(data){
          var metroAreaID = data.resultsPage.results.location[0].metroArea.id;
          resolve(metroAreaID);
      });
    });
  };

  function getUpcomingEvents(metroAreaID) {
    $("#localEventsList").html("");
    var eventUrl = 'https://api.songkick.com/api/3.0/metro_areas/' +
    metroAreaID +
    '/calendar.json?apikey=qMMmyACVKOgL3Kgb' + '&jsoncallback=?';
    $.getJSON(eventUrl, function(data){
      if($.isEmptyObject(data.resultsPage.results)) {
        $("#localEventsList").append("<a class=\"list-group-item\" href=\"#\">No events near you...</a>");
      } else {
        $.each(data.resultsPage.results.event, function (i, event) {
          var uri = event.uri;
          var displayName = event.displayName;
          $("#localEventsList").append("<a class=\"list-group-item\" href="+"\""+uri+"\""+
            "onClick=\"return popup(this, 'popup')\">"+displayName+"</a>");
          return i<4;
        });
      };
    });
  };

  $("#searchBar").submit(function() {
    searchByLocation();
  });

  //MODAL SCALING
  $('#myModal').on('show.bs.modal', function () {
    $('.modal-content').css('height',$( window ).height()*0.8);
  });

  // CALLING THE FUNCTIONS IN A CHAIN
  myPlaylist.remove();
  getLocation().then(function(getLocPromise) {
    console.log('THE FIRST PROMISE: (see object below)');
    console.log(getLocPromise);
    showPosition().then(function(positionPromise) {
      positionData = positionPromise;
      console.log('THE SECOND PROMISE: (see object below)');
      console.log(positionData);
      document.getElementById("currentLocation").innerHTML = positionData.cityName;
      getArtists(positionData).then(function(artistsObjectPromise) {
        console.log('THE THIRD PROMISE: (see object below)');
        console.log(artistsObjectPromise);
        getArtistTopTracks(artistsObjectPromise, positionData).then(function(topTracksPromise) {
          console.log('THE FOURTH PROMISE: ' + topTracksPromise);
          console.log("MyPlaylist (see below)");
          console.log(myPlaylist);
          $(".spinner").fadeOut("slow");
          //updateCurrentArtistFromPlaylist();
        });
      });
    });
    getSongKickMetroID(positionData).then(function(metroAreaIDPromise) {
      getUpcomingEvents(metroAreaIDPromise);
    });

  });

  function searchByLocation() {
    myPlaylist.remove();
    $(".spinner").fadeIn("slow");
    artistInfoDisplayed = false;
    searchLocation().then(function(getLocPromise) {
      console.log('THE FIRST PROMISE: (see object below)');
      console.log(getLocPromise);
      showPosition().then(function(positionPromise) {
        positionData = positionPromise;
        console.log('THE SECOND PROMISE: (see object below)');
        console.log(positionData);
        document.getElementById("currentLocation").innerHTML = positionData.cityName;
        getArtists(positionData).then(function(artistsObjectPromise) {
          console.log('THE THIRD PROMISE: (see object below)');
          console.log(artistsObjectPromise);
          getArtistTopTracks(artistsObjectPromise, positionData).then(function(topTracksPromise) {
            console.log('THE FOURTH PROMISE: ' + topTracksPromise);
            console.log("MyPlaylist (see below)");
            console.log(myPlaylist);
             $(".spinner").fadeOut("slow");
          });
        });
      });
      getSongKickMetroID(positionData).then(function(metroAreaIDPromise) {
        getUpcomingEvents(metroAreaIDPromise);
      });
    });
  };

  function updateCurrentArtistFromPlaylist() {
    console.log("myPlaylist - see below");
    console.log(myPlaylist.playlist[0]);

    var artist = myPlaylist.playlist[0].artist;
    var title = myPlaylist.playlist[0].title;
    var poster = myPlaylist.playlist[0].poster;
    var bio = myPlaylist.playlist[0].bio;
    var news = myPlaylist.playlist[0].news;

    displayCurrentArtist(document, artist, title, poster, bio, news);
  }

});