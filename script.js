$(document).ready(function() {

    $.getJSON("http://developer.echonest.com/api/v4/artist/search?api_key=&format=json&artist_location=manchester+england&min_familiarity=0.5&sort=hotttnesss-desc&results=50&bucket=artist_location",
        function(data){
        // data is JSON response object
        console.log(data.response);
        $("#results").append("<li>"+data.response.artists[0].name+"</li>");
    });

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
  $('#demo').append("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude);
  };
});


