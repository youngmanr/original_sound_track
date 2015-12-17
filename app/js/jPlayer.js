var playlistTest = function() {
    var myPlaylist = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    }, [
        {
            title:"Cro Magnon Man",
            artist:"The Stark Palace",
            mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
            oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg",
            poster: "http://www.jplayer.org/audio/poster/The_Stark_Palace_640x360.png (281KB)"
        }
    ], {
        playlistOptions: {
            enableRemoveControls: true
        },
        swfPath: "../dist/jplayer",
        supplied: "webmv, ogv, m4v, oga, mp3",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        audioFullScreen: true
    });

$("#test").click(function() {
  console.log("test button");
  console.log(myPlaylist);
  myPlaylist.setPlaylist([
    {
      title:"Cro Magnon Man",
      artist:"The Stark Palace",
      mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
      oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg",
      poster: "http://www.jplayer.org/audio/poster/The_Stark_Palace_640x360.png"
    },
    {
      title:"Your Face",
      artist:"The Stark Palace",
      mp3:"http://www.jplayer.org/audio/mp3/TSP-05-Your_face.mp3",
      oga:"http://www.jplayer.org/audio/ogg/TSP-05-Your_face.ogg",
      poster: "http://www.jplayer.org/audio/poster/The_Stark_Palace_640x360.png"
    },
    {
      title:"Hidden",
      artist:"Miaow",
      free: true,
      mp3:"http://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3",
      oga:"http://www.jplayer.org/audio/ogg/Miaow-02-Hidden.ogg",
      poster: "http://www.jplayer.org/audio/poster/Miaow_640x360.png"
    },
    {
      title:"Cyber Sonnet",
      artist:"The Stark Palace",
      mp3:"http://www.jplayer.org/audio/mp3/TSP-07-Cybersonnet.mp3",
      oga:"http://www.jplayer.org/audio/ogg/TSP-07-Cybersonnet.ogg",
                poster: "http://www.jplayer.org/audio/poster/The_Stark_Palace_640x360.png"
    },
    {
      title:"Tempered Song",
      artist:"Miaow",
      mp3:"http://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3",
      oga:"http://www.jplayer.org/audio/ogg/Miaow-01-Tempered-song.ogg",
      poster: "http://www.jplayer.org/audio/poster/Miaow_640x360.png"
    },
    {
      title:"Lentement",
      artist:"Miaow",
      mp3:"http://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3",
      oga:"http://www.jplayer.org/audio/ogg/Miaow-03-Lentement.ogg",
      poster: "http://www.jplayer.org/audio/poster/Miaow_640x360.png"
    }
  ]);
});

$("#skip").click(function() {
  console.log("skip button");
  myPlaylist.next();
});

};

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