Like = require("../models/like")

exports.index = (req, res) ->
  res.render "index", title: "(・∀・)イイネ!"

exports.graph = (req, res) ->
  res.render "graph", title: "(・∀・)イイネ! グラフ"

exports.monitor = (req, res) ->
  res.render "monitor", title: "(・∀・)イイネ! モニター"

exports.count = (req, res) ->
  (new Like).save (err) ->
    # do nothing.
  res.end ""

exports.likes = (req, res) ->
  start = new Date req.params.start
  end = new Date req.params.end

  cond =
    date:
      $gte: start
      $lte: end

  Like.find cond, (err, rows) ->
    throw err if err
    rows = (~~(o.date.getTime() /1000) for o in rows)
    rows = rows.reduce ((r, x) -> r[x] = ~~r[x] + 1; r), {}
    result = []
    for i in [~~(start.getTime() / 1000)..~~(end.getTime() / 1000)]
      result.push ~~rows[i]
    res.end JSON.stringify result

exports.admin = (req, res) ->
  res.render "admin", title: "(・∀・)イイネ! 管理"
