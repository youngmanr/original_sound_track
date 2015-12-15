$(document).ready(function() {

  var latitude;
  var longitude;
  var cityName;
  var country;
  var topBand;
  var geolocUrl;
  var echonestUrl;

  $('button').click(function() {
    console.log('button clicked');
    getLocation();
  });

  function getLocation() {
    console.log('get position');
    navigator.geolocation.watchPosition(showPosition, function() { console.log("failed to get position") }, {timeout: 30000});
  };

  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    geolocUrl = 'https://maps.googleapis.com/maps/api/geocode/json?&language=en&latlng=' + latitude + "," + longitude
                     '&key=AIzaSyAGWnWE0GeEPpCYmiy2mXZ9RnDGf_n3JQA';

    $.get(geolocUrl, function(response) {

      var results = response.results

      for (var result = 0; result < results.length; result++) {
        for (var component = 0; component < results[result].address_components.length; component++) {
          if(results[result].address_components[component].types.includes('locality')) {
            cityName = results[result].address_components[component].long_name;
          };
          if (results[result].address_components[component].types.includes('administrative_area_level_1')) {
            if (results[results.length-1].address_components[0].long_name === 'United Kingdom') {
              country = results[result].address_components[component].long_name;
            } else {
              country = results[results.length-1].address_components[0].long_name;
            }
          };
        };
      };




      // cityName = response.results[response.results.length-3].address_components[0].long_name;
      // country = response.results[response.results.length-1].address_components[0].long_name;

      console.log(cityName, country);
      console.log(response);
      echonestUrl = 'http://developer.echonest.com/api/v4/artist/search?api_key=BG6IJZJJYOKNETBX8' +
                    '&format=json' +
                    // '&artist_location=' + convToParam(cityName) + "+" + convToParam(country) +
                    '&artist_location=' + cityName + '+' + country +
                    '&min_familiarity=0.1' +
                    '&sort=hotttnesss-desc&results=35' +
                    '&bucket=artist_location';
                    console.log(echonestUrl);
      getArtists();
    });
  };

  // ALTERNATIVE GEOLOCATION - a lot easier
  // $.get("http://ipinfo.io", function(response) {
  //   console.log(response.city, response.country, response.region);
  // }, "jsonp");

  function getArtists() {
    $.getJSON(echonestUrl,
        function(data){
        // data is JSON response object
        console.log(data.response);
        $("#results").append("<li>"+data.response.artists[0].name+"</li>");
    });
  };

  function convToParam(words) {
    var result = words.split(" ");
    result = result.join("+");
    console.log(result);
  }

});

