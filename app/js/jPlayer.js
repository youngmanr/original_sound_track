var myPlaylist = new jPlayerPlaylist({
  jPlayer: "#jquery_jplayer_1",
  cssSelectorAncestor: "",
  cssSelector: {
          title: "#title",
          play: "#play",
          pause: "#pause",
          stop: "#stop",
  }
},
[], //EMPTY PLAYLIST
{
  playlistOptions: {
    enableRemoveControls: true
  },
  swfPath: "/js",
  supplied: "mp3",
  smoothPlayBar: true,
  keyEnabled: true,

  play: function(e) {
    updateDisplayedTrackTitle(e);
  },
  // ready: console.log('playlist loaded'),

  autoplay: true,
  audioFullScreen: true, // Allows the audio poster to go full screen via keyboard
  useStateClassSkin: true
});

$("#play").click(function() {
  console.log("play button");
  myPlaylist.play();
});

$("#pause").click(function() {
  console.log("skip button");
  myPlaylist.pause();
});

$("#skip").click(function() {
  console.log("skip button");
  myPlaylist.next();
});

function updateDisplayedTrackTitle(e) {
  var document = e.currentTarget.ownerDocument;
  var artist = e.jPlayer.status.media.artist; var artist = e.jPlayer.status.media.artist;
  var title = e.jPlayer.status.media.title;
  var poster = e.jPlayer.status.media.poster;
  var bio = e.jPlayer.status.media.bio;
  var news = e.jPlayer.status.media.news;


  console.log(bio);

  document.getElementById("currentArtist").innerHTML = artist;
  document.getElementById("currentTrack").innerHTML = title;
  document.getElementById("currentPoster").src = poster;
  document.getElementById("bio_full").innerHTML = bio.text;
  document.getElementById("playingArtistBiography").innerHTML = bio.text.substring(0,500) +
                          '<a data-toggle="modal" data-target="#myModal">... see more</a>';




  //$("playingArtistBiography").text(bio.substring(0,150) + '...');


  $('#playingArtistNews').html(""); // Clears previous articles before adding new

  for (var i = 0; i < news.length && i < 10; i++) {
    $('#playingArtistNews').append("<a class=\"list-group-item\" href="+"\""+news[i].url+"\""+"onClick=\"return popup(this, 'popup')\">"+news[i].name+"</a></li>");
  };
}