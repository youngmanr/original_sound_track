$(document).ready(function() {

    $.getJSON("http://developer.echonest.com/api/v4/artist/search?api_key=BG6IJZJJYOKNETBX8&format=json&artist_location=manchester+england&min_familiarity=0.5&sort=hotttnesss-desc&results=50&bucket=artist_location",
        function(data){
        // data is JSON response object
        console.log(data.response);
        $("#results").append("<li>"+data.response.artists[0].name+"</li>");
    });

  var geolocUrl;

  $('button').click(function() {
    console.log('button clicked');
    getLocation();
  });

  function getLocation() {
    console.log('get position');
    navigator.geolocation.watchPosition(showPosition);
  };

  function showPosition(position) {
    console.log('show position');
    geolocUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude+ "," + position.coords.longitude
                    '&key=AIzaSyAGWnWE0GeEPpCYmiy2mXZ9RnDGf_n3JQA';

    $.get(geolocUrl, function(response) {
      console.log(response.results[6].address_components[0].long_name);
    });
  };
});


