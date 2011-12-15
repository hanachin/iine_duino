(function() {
  var Like;

  Like = require("../models/like");

  exports.index = function(req, res) {
    return res.render("index", {
      title: "(・∀・)イイネ!"
    });
  };

  exports.graph = function(req, res) {
    return res.render("graph", {
      title: "(・∀・)イイネ! グラフ"
    });
  };

  exports.monitor = function(req, res) {
    return res.render("monitor", {
      title: "(・∀・)イイネ! モニター"
    });
  };

  exports.likes = function(req, res) {
    var cond, end, start;
    start = new Date(req.params.start);
    end = new Date(req.params.end);
    cond = {
      date: {
        $gte: start,
        $lte: end
      }
    };
    return Like.find(cond, function(err, rows) {
      var i, o, result, _ref, _ref2;
      if (err) throw err;
      rows = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          o = rows[_i];
          _results.push(~~(o.date.getTime() / 1000));
        }
        return _results;
      })();
      rows = rows.reduce((function(r, x) {
        r[x] = ~~r[x] + 1;
        return r;
      }), {});
      result = [];
      for (i = _ref = ~~(start.getTime() / 1000), _ref2 = ~~(end.getTime() / 1000); _ref <= _ref2 ? i <= _ref2 : i >= _ref2; _ref <= _ref2 ? i++ : i--) {
        result.push(~~rows[i]);
      }
      return res.end(JSON.stringify(result));
    });
  };

  exports.admin = function(req, res) {
    return res.render("admin", {
      title: "(・∀・)イイネ! 管理"
    });
  };

}).call(this);
