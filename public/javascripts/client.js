(function() {
  var iine, send_iine, socket, status;

  status = $("#status");

  iine = $("#iine");

  socket = io.connect('http://localhost:3000');

  send_iine = function() {
    return socket.send("iine");
  };

  socket.on("connect", function() {
    status.text("connected");
    return iine.bind("click", send_iine);
  }).on("disconnect", function() {
    status.text("disconnected");
    return iine.unbind("click", send_iine);
  }).on("message", function(count) {
    var css_props, e, font_size, text;
    iine.text("(・∀・)イイネ!×" + (+count));
    text = "(・∀・)イイネ!";
    css_props = +count % 20 === 0 && +count !== 0 ? (text = "スゴク(・∀・)イイネ!", font_size = document.width / text.length * 0.8, {
      top: (document.height - font_size) * Math.random(),
      left: (document.width - font_size * text.length) * Math.random(),
      "font-size": font_size,
      position: "fixed"
    }) : {
      top: (document.height - 20) * Math.random(),
      left: (document.width - 100) * Math.random(),
      position: "fixed"
    };
    e = $("<div></div>").text(text).css(css_props);
    e.fadeIn("fast", function() {
      return $(this).fadeOut("slow", function() {
        return $(this).remove();
      });
    });
    return $(document.body).append(e);
  });

}).call(this);
