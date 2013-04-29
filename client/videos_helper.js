(function() {
  var load_videos, root, search_videos;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  search_videos = function(term, success_cb, error_cb) {
    var params;
    params = {
      url: "http://gdata.youtube.com/feeds/api/videos?q=" + term + "&max-results=25&v=2&format=5&alt=json-in-script&callback=?",
      context: this,
      dataType: 'jsonp',
      success: function(data) {
        var entries, feed;
        feed = data.feed;
        entries = feed.entry || [];
        entries = _.map(entries, function(item) {
          return {
            'title': item.title.$t,
            'img_url': item.media$group.media$thumbnail[0].url,
            'vid': item.media$group.yt$videoid.$t
          };
        });
        return success_cb(entries);
      },
      error: function() {
        return error_cb();
      }
    };
    return $.ajax(params);
  };

  load_videos = function(success_cb, error_cb) {
    var params;
    params = {
      url: "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json-in-script&format=5&callback=?",
      dataType: 'jsonp',
      success: function(data) {
        var entries, feed;
        feed = data.feed;
        entries = feed.entry || [];
        entries = _.map(entries, function(item) {
          return {
            'title': item.title.$t,
            'img_url': item.media$group.media$thumbnail[0].url,
            'vid': item.media$group.yt$videoid.$t
          };
        });
        return success_cb(entries);
      },
      error: function() {
        return error_cb();
      }
    };
    return $.ajax(params);
  };

  root.load_videos = load_videos;

  root.search_videos = search_videos;

}).call(this);
