(function() {
  var methods;

  methods = {
    create_hangout: function(name) {
      var hangout, id;
      hangout = {
        name: name,
        when: (new Date()).getTime(),
        online_users: 0,
        videos_played: 0,
        vid: null,
        vtitle: null,
        vimg_url: null,
        activities: []
      };
      id = HangOuts.insert(hangout);
      return id;
    },
    queue_video: function(hangout_id, video) {
      var id, item;
      item = {
        hangout_id: hangout_id,
        added_when: (new Date()).getTime(),
        vid: video.vid,
        vtitle: video.title,
        vimg_url: video.img_url,
        vote_count: 1,
        played_count: 0,
        last_played_when: null
      };
      id = PlayList.insert(item);
      return video.vid;
    },
    play_video: function(hangout_id, video) {
      HangOuts.update({
        _id: hangout_id
      }, {
        $set: {
          vid: video.vid,
          vtitle: video.vtitle,
          vimg_url: video.vimg_url
        }
      });
      return video.vid;
    },
    play_next: function(hangout_id) {
      var idx, num_items, playlist_item;
      num_items = PlayList.find({
        hangout_id: hangout_id
      }).count();
      idx = Math.floor(Math.random() * num_items);
      playlist_item = PlayList.find({
        hangout_id: hangout_id
      }).fetch()[idx];
      if (playlist_item) {
        HangOuts.update({
          _id: hangout_id
        }, {
          $set: {
            vid: playlist_item.vid,
            vtitle: playlist_item.vtitle,
            vimg_url: playlist_item.vimg_url
          }
        });
        return playlist_item.vid;
      } else {
        return null;
      }
    },
    remove_video: function(playlist_item) {
      PlayList.remove({
        hangout_id: playlist_item.hangout_id,
        vid: playlist_item.vid
      });
      return playlist_item.vid;
    },
    report_activity: function(data) {
      var id;
      data.when = (new Date()).getTime();
      id = Activity.insert(data);
      return id;
    }
  };

  Meteor.methods(methods);

}).call(this);
