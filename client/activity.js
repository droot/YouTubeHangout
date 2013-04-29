(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.activity_actions = {
    JOINED_HANGOUT: 1,
    QUEUED_VIDEO: 2,
    PLAYED_VIDEO: 3,
    SAYS: 4
  };

  root.report_activity = function(type, data) {
    var item;
    item = {
      actor: Session.get('user_name'),
      hangout_id: Session.get('hangout_id'),
      type: type,
      data: data
    };
    return Meteor.call('report_activity', item, function(err, id) {
      return console.log("reported activity successfully");
    });
  };

}).call(this);
