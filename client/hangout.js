(function() {
  var ensure_user_name, load_hangout, play_current_video, root, update_activity_bar;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  play_current_video = function() {
    var update;
    update = function() {
      var ctx;
      ctx = new Meteor.deps.Context();
      ctx.on_invalidate(update);
      return ctx.run(function() {
        var current_video;
        current_video = HangOuts.findOne({
          _id: Session.get('hangout_id')
        });
        if (current_video && current_video.vid) {
          console.log("currently played video: " + current_video.vid);
          return play_video(current_video.vid);
        }
      });
    };
    return update();
  };

  ensure_user_name = function() {
    var name;
    name = $.cookie('user_name');
    console.log("read user name " + name);
    if (name) return Session.set('user_name', name);
  };

  root.refresh_activity_bar = function() {
    var scroller;
    return;
    scroller = Session.get('scroller');
    if (scroller) {
      return scroller.refresh();
    } else {
      scroller = $('.box-wrap').antiscroll().data('antiscroll');
      return Session.set('scroller', scroller);
    }
  };

  update_activity_bar = function() {
    var update;
    update = function() {
      var ctx;
      ctx = new Meteor.deps.Context();
      ctx.on_invalidate(update);
      return ctx.run(function() {
        var hangout_id, num;
        hangout_id = Session.get('hangout_id');
        num = Activity.find({
          hangout_id: hangout_id
        }, {
          sort: {
            when: +1
          }
        }).count();
        if (num) return refresh_activity_bar();
      });
    };
    return update();
  };

  load_hangout = function(id) {
    Session.set('page', 'hangout');
    Session.set('hangout_id', id);
    ensure_user_name();
    return play_current_video();
  };

  root.initialize_hangout = load_hangout;

}).call(this);
