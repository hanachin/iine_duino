(function() {
  var chart_data, chart_option, count, plot, prev, socket, status, x;

  status = $("#status");

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

  count = 0;

  prev = 0;

  chart_data = (function() {
    var _results;
    _results = [];
    for (x = 0; x <= 60; x++) {
      _results.push(0);
    }
    return _results;
  })();

  plot = function() {
    chart_data.shift();
    chart_data.push(count - prev);
    prev = count;
    $("#chart").html("");
    return $.jqplot('chart', [chart_data], chart_option);
  };

  setInterval(plot, 1000);

  socket = io.connect('http://localhost:3000');

  socket.on("connect", function() {
    return status.text("connected");
  }).on("disconnect", function() {
    return status.text("disconnected");
  }).on("message", function(c) {
    if (+c === 0) prev = 0;
    return count = c;
  });

}).call(this);
