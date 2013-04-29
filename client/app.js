(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.init = function() {
    return $(document).ready(function() {
      return $('.carousel').carousel({
        interval: 2000
      });
    }, Backbone.history.start({
      pushState: true
    }));
  };

  Meteor.startup(init);

}).call(this);
