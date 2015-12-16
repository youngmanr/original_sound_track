var myPlaylist = new jPlayerPlaylist({
  jPlayer: "#jquery_jplayer_1",
  cssSelectorAncestor: "#jp_container_1"
}, [
  {
    title:"Daydreamer - Gryffin Remix",
    artist:"Bipolar Sunshine",
    free: false,
    mp3:"https://p.scdn.co/mp3-preview/f4c0091b7edef07bee2f09c74a524741d47a4d16"
  },
  {
    title:"Daydreamer",
    artist:"Adele",
    free: false,
    mp3:"https://p.scdn.co/mp3-preview/c8d0e04cfb0a78008b8c07c0543019812b81853c"
  },
  {
    title:"Daydreamer (ORIGINAL)",
    artist:"Bipolar Sunshine",
    free: false,
    mp3:"https://p.scdn.co/mp3-preview/dfe78c487aa9d464e2b2cb7222d8ca15804136e2"
  }
], {
  playlistOptions: {
    enableRemoveControls: true
  },
  swfPath: "/js",
  supplied: "mp3",
  smoothPlayBar: true,
  keyEnabled: true,
  audioFullScreen: false
});


$(document).ready(function(){
  $("#jquery_jplayer_1").jPlayer({
    ready: function () {
      $(this).jPlayer("setMedia", {
        title: "Track title",
        mp3: "https://p.scdn.co/mp3-preview/c8d0e04cfb0a78008b8c07c0543019812b81853c"
      });
    },
    swfPath: "/js",
    supplied: "mp3"
  });
});