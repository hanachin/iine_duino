(function() {
  var BUTTON, LED, Like, app, arduino, blink, blink_id, board, count, express, io, led, prev_val, routes;

  arduino = require("arduino");

  express = require("express");

  routes = require("./routes");

  Like = require("./models/like");

  app = module.exports = express.createServer();

  app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express.static(__dirname + "/public"));
  });

  app.configure("development", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure("production", function() {
    return app.use(express.errorHandler());
  });

  app.get("/", routes.index);

  app.get("/graph", routes.graph);

  app.get("/monitor", routes.monitor);

  app.get("/likes/:start/:end", routes.likes);

  app.get("/admin", routes.admin);

  app.listen(3000);

  count = 0;

  io = require("socket.io").listen(app);

  io.sockets.on("connection", function(socket) {
    socket.send(count);
    return socket.on("message", function(msg) {
      io.sockets.send(++count);
      return (new Like).save(function(err) {});
    }).on("disconnect", function() {});
  });

  app.post("/reset", function(req, res) {
    if (req.param('password') === "pass") {
      count = 0;
      io.sockets.send(count);
    }
    return res.redirect("/admin");
  });

  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

  board = arduino.connect("/dev/tty.usbmodemfa131");

  LED = 13;

  BUTTON = 7;

  board.pinMode(LED, arduino.OUTPUT);

  board.pinMode(BUTTON, arduino.INPUT);

  led = {
    on: function() {
      return board.digitalWrite(LED, arduino.HIGH);
    },
    off: function() {
      return board.digitalWrite(LED, arduino.LOW);
    }
  };

  prev_val = arduino.LOW;

  blink_id = 0;

  blink = function() {
    return board.digitalRead(BUTTON, function(val) {
      if (val !== prev_val) {
        io.sockets.send(++count);
        return prev_val = val;
      }
    });
  };

  setInterval(blink, 100);

}).call(this);
