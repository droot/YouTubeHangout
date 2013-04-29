(function() {
  var YTHRouter, root,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  YTHRouter = (function(_super) {

    __extends(YTHRouter, _super);

    function YTHRouter() {
      YTHRouter.__super__.constructor.apply(this, arguments);
    }

    YTHRouter.prototype.routes = {
      "": "home",
      ":id": "hangout"
    };

    YTHRouter.prototype.home = function() {
      return Session.set('page', 'home');
    };

    YTHRouter.prototype.hangout = function(id) {
      return initialize_hangout(id);
    };

    YTHRouter.prototype.load_hangout = function(id) {
      return this.navigate("" + id, true);
    };

    return YTHRouter;

  })(Backbone.Router);

  root.Router = new YTHRouter();

}).call(this);
