(function() {
  var config, is_player_ready, load_player, onPlayerReady, onPlayerStateChange, onYouTubePlayerAPIReady, play_video, player, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  player = null;

  is_player_ready = false;

  onPlayerReady = function(event) {
    console.log("player is ready to play any video...");
    is_player_ready = true;
    return event.target.playVideo();
  };

  onPlayerStateChange = function(event) {
    console.log("player state changed received " + event.data);
    if (event.data === YT.PlayerState.ENDED) {
      console.log("A video just finished, lets play next");
      return Meteor.call('play_next', Session.get('hangout_id'), function(err, id) {
        if (id) {
          return console.log("new video " + id + " is next....");
        } else {
          return console.log("some error in selecting next video");
        }
      });
    }
  };

  config = {
    height: '390',
    width: '640',
    videoId: 'u1zgFlCw8Aw',
    playerVars: {
      autoplay: 0,
      controls: 1,
      wmode: 'transparent'
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  };

  onYouTubePlayerAPIReady = function() {
    return player = new YT.Player('player', config);
  };

  load_player = function(vid) {
    var firstScriptTag, tag;
    if (vid) config.videoId = vid;
    tag = document.createElement('script');
    tag.src = "http://www.youtube.com/player_api";
    firstScriptTag = document.getElementsByTagName('script')[0];
    return firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  };

  play_video = function(vid) {
    if (player && is_player_ready) {
      return player.loadVideoById(vid);
    } else {
      return load_player(vid);
    }
  };

  root.onYouTubePlayerAPIReady = onYouTubePlayerAPIReady;

  root.load_player = load_player;

  root.play_video = play_video;

}).call(this);
