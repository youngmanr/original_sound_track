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

  console.log(title);
  console.log(artist);
  console.log(poster);
  console.log(bio);
  document.getElementById("currentArtist").innerHTML = artist;
  document.getElementById("currentTrack").innerHTML = title;
  document.getElementById("currentPoster").src = poster;
  document.getElementById("playingArtistBiography").innerHTML = bio;
  
}