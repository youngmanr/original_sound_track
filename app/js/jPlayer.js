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

  autoplay: true,
  audioFullScreen: true, // Allows the audio poster to go full screen via keyboard
  useStateClassSkin: true
});

$("#play").click(function() {
  console.log("play button");
  myPlaylist.play();
});

$("#pause").click(function() {
  console.log("pause button");
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
  displayCurrentArtist(document, artist, title, poster, bio, news);
  console.log(myPlaylist.playlist[myPlaylist.current].news);
  updateAllNewsModal(myPlaylist.playlist[myPlaylist.current].news);
}

function displayCurrentArtist(document, artist, title, poster, bio, news) {
  document.getElementById("currentArtist").innerHTML = artist;
  document.getElementById("currentTrack").innerHTML = title;
  document.getElementById("currentPoster").src = poster;
  document.getElementById("bio_full").innerHTML = bio.text;

  //$("#playingArtistBiography").append("<a class=\"list-group-item\" href=\"#\""+
  //        '<a data-toggle="modal" data-target="#myModal">' + bio.text.substring(0,500) +'... see more</a>');

  $("#playingArtistBiography").html("<a class=\"list-group-item\">");
  if (bio.text.length > 500) {
    $("#playingArtistBiography > .list-group-item").append(bio.text.substring(0,500) +
      '...<strong><a data-toggle="modal" data-target="#myModal"><br/>(click to see more)<strong></a>');
  } else {
    $("#playingArtistBiography > .list-group-item").append(bio.text);
  };

  // Clears previous articles before adding new
  $('#playingArtistNews').html("");

  if(news.length === 0) {
    $('#playingArtistNews').append("<a class=\"list-group-item\">No news from this band...</a></li>");
  } else {
    for (var i = 0; i < news.length && i < 3; i++) {
      $('#playingArtistNews').append("<a class=\"list-group-item\" href="+"\""+news[i].url+"\""+"onClick=\"return popup(this, 'popup')\">"+news[i].name+"</a></li>");
    };
    $('#playingArtistNews').append("<a class=\"list-group-item\" href=\"#\""+
                                   '<a data-toggle="modal" id="moreNews" data-target="#newsModal"><strong>See more news</strong></a>')
  }
}

function updateAllNewsModal(news) {
  $('#news_full').html("");
  for (var i = 0; i < news.length; i++) {
    $('#news_full').append("<a class=\"list-group-item\" href="+"\""+news[i].url+"\""+"onClick=\"return popup(this, 'popup')\">"+news[i].name+"</a></li>");
  };
};












