$ ->
  date_format = (d) ->
    year = d.getFullYear()
    date = d.getDate()
    month = d.getMonth() + 1
    [month, date, year].join "/"

  time_format = (d) ->
    hour = d.getHours()
    min = d.getMinutes()
    sec = d.getSeconds()
    [hour, min, sec].join ":"

  countdown_format = (d) ->
    hour = d.getUTCHours()
    min = d.getUTCMinutes()
    sec = d.getUTCSeconds()
    (for s in [hour, min, sec]
      if "#{s}".length < 2 then "0#{s}" else "#{s}").join ":"

  $("#datepicker").datepicker().val date_format new Date

  $(".time_button").click ->
    $(".time_button").toggle()

  countdown_id = 0
  start = new Date
  stop = new Date

  $("#start_button").click ->
    start = new Date
    $("#start_time").val time_format start
    $("#stop_time").val ""
    countdown = ->
      count = new Date((new Date).getTime() - start.getTime())
      $("#count").val countdown_format count
    countdown_id = setInterval countdown, 1000

  $("#stop_button").click ->
    stop = new Date
    $("#stop_time").val time_format stop
    clearInterval countdown_id

    chart_option =
      title: "Likes Graph"
      axes:
        xaxis:
          label: "Time"
        yaxis:
          label: "Likes"
    console.log "/likes/#{start}/#{stop}/"
    $.getJSON "/likes/#{start}/#{stop}/", {}, (chart) ->
      $.jqplot 'chart', [chart], chart_option
