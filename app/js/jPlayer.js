var playerFunction = function(song){
  $("#jquery_jplayer_1").jPlayer({
    ready: function () {
      $(this).jPlayer("setMedia", {
        title: "Track title",
        mp3: song
      });
    },
    swfPath: "/js",
    supplied: "mp3"
  });
};