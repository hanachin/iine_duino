(function() {
  var Like, app, count, express, io, routes;

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

}).call(this);
