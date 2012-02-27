(function() {
  var Like, Schema, mongoose;

  mongoose = require('mongoose');

  mongoose.connect(process.env.MONGOLAB_URI);

  Schema = mongoose.Schema;

  Like = mongoose.model('likes', new Schema({
    date: {
      type: Date,
      "default": Date.now
    }
  }));

  module.exports = Like;

}).call(this);
