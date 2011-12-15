arduino = require("arduino")
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
app.get "/monitor", routes.monitor
app.get "/likes/:start/:end", routes.likes
app.get "/admin", routes.admin

app.listen 3000

count = 0
io = require("socket.io").listen app
io.sockets.on "connection", (socket) ->
  socket.send count
  socket
    .on "message", (msg) ->
      io.sockets.send ++count
      (new Like).save (err) ->
        # do nothing
    .on "disconnect", ->
      # io.sockets.send "disconnected"

app.post "/reset", (req, res) ->
  if req.param('password') is "pass"
    count = 0
    io.sockets.send count
  res.redirect "/admin"

console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env


# Arduino
board = arduino.connect "/dev/tty.usbmodemfa131"

# pin
LED = 13
BUTTON = 7

# setup
board.pinMode LED, arduino.OUTPUT
board.pinMode BUTTON, arduino.INPUT

led =
  on: -> board.digitalWrite LED, arduino.HIGH
  off:-> board.digitalWrite LED, arduino.LOW

prev_val = arduino.LOW
blink_id = 0
blink = ->
  board.digitalRead BUTTON, (val) ->
    if val isnt prev_val
      io.sockets.send ++count
      prev_val = val
      # led.on()
      # clearTimeout blink_id
      # setTimeout led.off, 100
setInterval blink, 100
