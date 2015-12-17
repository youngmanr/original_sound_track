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
          artist: song.artists[0].name,
          mp3: song.preview_url
        });

      });

      myPlaylist.play(0);
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


/////// ************************** PLAYER **************************

  $("#jquery_jplayer_1").jPlayer({

      play: function(e) {
        console.log(e.jPlayer.status.media.title)
      },
      // ready: function () {
      // //   console.log('player is ready');
      // //   $(this).jPlayer("setMedia", {
      // //     title: "THIS IS THE FIRST SONG",
      // //     mp3: "http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3"
      // //   });
      //   // myPlaylist.play(0);
      // },
      swfPath: "/js",
      supplied: "mp3"
  });

  var myPlaylist = new jPlayerPlaylist({
    jPlayer: "#jquery_jplayer_1",
    cssSelectorAncestor: "#jp_container_1"
  },
  [], //EMPTY PLAYLIST
  {
    playlistOptions: {
      enableRemoveControls: true
    },
    swfPath: "/js",
    supplied: "ogv, m4v, oga, mp3",
    smoothPlayBar: true,
    keyEnabled: true,
    ready: console.log('playlist loaded'),
    autoplay: true,
    audioFullScreen: true // Allows the audio poster to go full screen via keyboard
  });

  $("#skip").click(function() {
    console.log("skip button");
    myPlaylist.next();
  });

});