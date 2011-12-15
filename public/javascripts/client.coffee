status = $("#status")
iine = $("#iine")

socket = io.connect 'http://localhost:3000'

send_iine = ->
  socket.send "iine"

socket
  .on "connect", ->
    status.text "connected"
    iine.bind "click", send_iine
  .on "disconnect", ->
    status.text "disconnected"
    iine.unbind "click", send_iine
  .on "message", (count) ->
    iine.text("(・∀・)イイネ!×#{+count}")

    text = "(・∀・)イイネ!"
    css_props = if +count % 20 is 0 and +count isnt 0
      text = "スゴク(・∀・)イイネ!"
      font_size = document.width / text.length * 0.8

      top: (document.height - font_size) * Math.random()
      left: (document.width - font_size * text.length) * Math.random()
      "font-size": font_size
      position: "fixed"
    else
      top: (document.height - 20) * Math.random()
      left: (document.width - 100) * Math.random()
      position: "fixed"

    e = $("<div></div>").text(text).css(css_props)

    e.fadeIn "fast", -> $(this).fadeOut "slow", -> $(this).remove()

    $(document.body).append e
