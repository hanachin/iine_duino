express = require("express")
routes = require("./routes")
Like = require("./models/like")

app = module.exports = express.createServer()
app.configure ->
  app.set "views", __dirname + "/views"
  app.set "view engine", "jade"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + "/public")


app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()

app.get "/", routes.index
app.get "/graph", routes.graph
app.get "/api/count", routes.count
app.get "/monitor", routes.monitor
app.get "/likes/:start/:end", routes.likes
app.get "/admin", routes.admin

app.listen Number(process.env.PORT or 3000)

count = 0
io = require("socket.io").listen app
io.configure ->
  io.set("transports", ["xhr-polling"])
  io.set("polling duration", 10)
io.sockets.on "connection", (socket) ->
  socket.send count
  socket
    .on "message", (msg) ->
      io.sockets.send ++count
      (new Like).save (err) ->
        # do nothing
        console.log "mongo error", err
    .on "disconnect", ->
      # io.sockets.send "disconnected"

app.post "/reset", (req, res) ->
  if req.param('password') is "pass"
    count = 0
    io.sockets.send count
  res.redirect "/admin"

console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env
