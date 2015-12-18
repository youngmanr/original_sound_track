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
  supplied: "mp3",
  smoothPlayBar: true,
  keyEnabled: true,

  // ready: console.log('playlist loaded'),

  autoplay: true,
  audioFullScreen: true // Allows the audio poster to go full screen via keyboard
});

$("#skip").click(function() {
  console.log("skip button");
  myPlaylist.next();
});