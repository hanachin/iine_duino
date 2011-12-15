mongoose = require 'mongoose'
mongoose.connect 'mongodb://localhost/likes'

Schema = mongoose.Schema
Like = mongoose.model 'likes', new Schema {
  date: {type: Date, default: Date.now}
}

module.exports = Like
