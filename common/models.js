(function() {
  var pub_fn, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.HangOuts = new Meteor.Collection('hangouts');

  root.PlayList = new Meteor.Collection('playlist');

  root.Activity = new Meteor.Collection('activity');

  if (Meteor.is_server) {
    pub_fn = function(hangout_id) {
      var count, handle, self, uuid;
      self = this;
      uuid = Meteor.uuid();
      count = 0;
      handle = HangOuts.find({
        _id: hangout_id
      }).observe({
        changed: function(doc, idx, old_doc) {
          self.set("currently-playing", uuid, "video", doc.video.vid);
          return self.flush();
        }
      });
      return self.onStop(function() {
        handle.stop();
        self.unset("currently-playing", uuid, "currently-playing");
        return self.flush();
      });
    };
  }

}).call(this);
