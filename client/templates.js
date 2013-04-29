(function() {
  var open_video_search_dialog, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Template = Template;

  Handlebars.registerHelper('wif', function(context, options) {
    var op_type, val;
    op_type = options.hash['op'];
    val = parseInt(options.hash['val'], 10);
    switch (op_type) {
      case 'eq':
        if (context === val) return options.fn(this);
        break;
      case 'gt':
        if (context > val) return options.fn(this);
    }
  });

  Template.activity_view.activities = function() {
    var hangout_id;
    hangout_id = Session.get('hangout_id');
    return Activity.find({
      hangout_id: hangout_id
    }, {
      sort: {
        when: +1
      }
    });
  };

  Template.message_box.events = {
    'click #send-btn, submit': function(ev) {
      var comment;
      comment = $('#comment-input').val();
      report_activity(activity_actions.SAYS, {
        comment: comment
      });
      $('#comment-input').val('');
      refresh_activity_bar();
      return ev.preventDefault();
    }
  };

  Template.playlist.playlist = function() {
    var hangout_id;
    hangout_id = Session.get('hangout_id');
    return PlayList.find({
      hangout_id: hangout_id
    });
  };

  Template.playlist.nr_videos = function() {
    var hangout_id;
    hangout_id = Session.get('hangout_id');
    return PlayList.find({
      hangout_id: hangout_id
    }).count();
  };

  Template.video_list.videos = function() {
    return Session.get('videos');
  };

  Template.video_list.events = {
    'afterinsert': function() {
      console.log("video_list is rendered.....");
      return refresh_video_search_scroller();
    }
  };

  Template.slideshow.events = {
    'afterinsert': function() {
      return $('.carousel').carousel({
        interval: 2000
      });
    }
  };

  Template.playlist.link = function() {
    return "http://yth.meteor.com/" + (Session.get('hangout_id'));
  };

  Template.video_search.events = {
    "click .search_btn": function(ev) {
      ev.preventDefault();
      return search_videos($("#search_box").val(), function(videos) {
        console.log("new set of videos received...");
        return Session.set('videos', videos);
      }, function() {
        return alert('error in loading videos...');
      });
    },
    "click .close": function(ev) {
      console.log("closing the video search dialog...");
      return $('#videoModal').toggle();
    }
  };

  root.refresh_video_search_scroller = function() {
    var scroller;
    return scroller = $('.box-wrap').antiscroll().data('antiscroll');
  };

  open_video_search_dialog = function() {
    var video_search_initialized;
    video_search_initialized = Session.get('video_search_initialized');
    if (video_search_initialized) {
      return $('#videoModal').toggle();
    } else {
      console.log("video search is being intiailized...");
      $('#videoModal').modal({
        show: false,
        keyboard: true
      });
      $('#videoModal').toggle();
      Session.set('video_search_initialized', true);
      return load_videos(function(videos) {
        Session.set('videos', videos);
        return refresh_video_search_scroller();
      }, function() {
        return alert('error in loading videos...');
      });
    }
  };

  Template.playlist_container.events = {
    'click .add_video': function(ev) {
      ev.preventDefault();
      open_video_search_dialog();
    }
  };

  Template.playlist_item.events = {
    'click .play_btn': function(ev) {
      var video;
      ev.preventDefault();
      video = this;
      console.log("Video play request " + video.vtitle + " vid: " + video.vid);
      Meteor.call('play_video', Session.get('hangout_id'), video, function(err, id) {
        return play_video(id);
      });
      report_activity(activity_actions.PLAYED_VIDEO, video);
      return refresh_activity_bar();
    },
    'click .remove_btn': function(ev) {
      var video;
      ev.preventDefault();
      video = this;
      console.log("Video being removed.... " + video.vtitle + " vid: " + video.vid);
      return Meteor.call('remove_video', video, function(err, id) {
        return console.log("video deleted successfully....");
      });
    }
  };

  Template.name_entry_dialog.show_dialog = function() {
    var page;
    page = Session.get('page');
    if (page === "hangout") {
      if (Session.get('user_name')) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  Template.name_entry_dialog.events = {
    'click #go_btn, submit': function(ev) {
      var name;
      name = $('#name-input').val();
      console.log("user just gave us a name " + name);
      $('#myModal').removeClass('hide');
      Session.set('user_name', name);
      $.cookie('user_name', name, {
        path: '/'
      });
      report_activity(activity_actions.JOINED_HANGOUT, null);
      refresh_activity_bar();
      return ev.preventDefault();
    }
  };

  Template.video.events = {
    'click .queue_btn': function(ev) {
      ev.preventDefault();
      console.log("Video requested " + this.title + " vid: " + this.vid);
      Meteor.call('queue_video', Session.get('hangout_id'), this, function(err, id) {
        return console.log("video queued successfully....");
      });
      return report_activity(activity_actions.QUEUED_VIDEO, this);
    }
  };

  Template.page_stack.is_hangout_page = function() {
    var page;
    page = Session.get('page');
    return page === "hangout";
  };

  Template.home_page.events = {
    "click .start_hangout_btn": function(ev) {
      ev.preventDefault();
      return Meteor.call('create_hangout', 'LivingRoom', function(err, id) {
        if (!err) return Router.load_hangout(id);
      });
    }
  };

}).call(this);
