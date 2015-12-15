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