// $("#jquery_jplayer_1").jPlayer({

//     play: function(e) {
//       console.log(e.jPlayer.status.media.title)
//     },
//     ready: function () {
//       console.log('player is ready');
//       $(this).jPlayer("setMedia", {
//         title: "THIS IS THE FIRST SONG",
//         mp3: "http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3"
//       });
//     },
//     swfPath: "/js",
//     supplied: "mp3"
// });


var myPlaylist = new jPlayerPlaylist({
  jPlayer: "#jquery_jplayer_1",
  cssSelectorAncestor: "#jp_container_1"
},
[     {
      title:"Lentement",
      artist:"Miaow",
      mp3:"http://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3",
      oga:"http://www.jplayer.org/audio/ogg/Miaow-03-Lentement.ogg",
      poster: "http://www.jplayer.org/audio/poster/Miaow_640x360.png"
    }], //EMPTY PLAYLIST
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