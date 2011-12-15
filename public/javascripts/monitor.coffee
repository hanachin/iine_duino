status = $("#status")

chart_option =
  title: "Likes Graph"
  axes:
    xaxis:
      label: "Time"
    yaxis:
      label: "Likes"

count = 0
prev = 0
chart_data = (0 for x in [0..60])
plot = ->
  chart_data.shift()
  chart_data.push count - prev
  prev = count
  $("#chart").html ""
  $.jqplot 'chart', [chart_data], chart_option
setInterval plot, 1000

socket = io.connect 'http://localhost:3000'
socket
  .on "connect", ->
    status.text "connected"
  .on "disconnect", ->
    status.text "disconnected"
  .on "message", (c) ->
    if +c is 0
      prev = 0
    count = c
