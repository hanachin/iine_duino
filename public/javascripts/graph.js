
  $(function() {
    var countdown_format, countdown_id, date_format, start, stop, time_format;
    date_format = function(d) {
      var date, month, year;
      year = d.getFullYear();
      date = d.getDate();
      month = d.getMonth() + 1;
      return [month, date, year].join("/");
    };
    time_format = function(d) {
      var hour, min, sec;
      hour = d.getHours();
      min = d.getMinutes();
      sec = d.getSeconds();
      return [hour, min, sec].join(":");
    };
    countdown_format = function(d) {
      var hour, min, s, sec;
      hour = d.getUTCHours();
      min = d.getUTCMinutes();
      sec = d.getUTCSeconds();
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = [hour, min, sec];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          if (("" + s).length < 2) {
            _results.push("0" + s);
          } else {
            _results.push("" + s);
          }
        }
        return _results;
      })()).join(":");
    };
    $("#datepicker").datepicker().val(date_format(new Date));
    $(".time_button").click(function() {
      return $(".time_button").toggle();
    });
    countdown_id = 0;
    start = new Date;
    stop = new Date;
    $("#start_button").click(function() {
      var countdown;
      start = new Date;
      $("#start_time").val(time_format(start));
      $("#stop_time").val("");
      countdown = function() {
        var count;
        count = new Date((new Date).getTime() - start.getTime());
        return $("#count").val(countdown_format(count));
      };
      return countdown_id = setInterval(countdown, 1000);
    });
    return $("#stop_button").click(function() {
      var chart_option;
      stop = new Date;
      $("#stop_time").val(time_format(stop));
      clearInterval(countdown_id);
      chart_option = {
        title: "Likes Graph",
        axes: {
          xaxis: {
            label: "Time"
          },
          yaxis: {
            label: "Likes"
          }
        }
      };
      console.log("/likes/" + start + "/" + stop + "/");
      return $.getJSON("/likes/" + start + "/" + stop + "/", {}, function(chart) {
        return $.jqplot('chart', [chart], chart_option);
      });
    });
  });
