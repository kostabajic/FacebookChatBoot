var mongoose = require('mongoose');

var JokeSchema = new mongoose.Schema(
  {
    user_id: {type: String, required: true, max: 100},
    message: {type: String, required: true, max: 100},
    is_aktive:{type: Number,  max: 1 }
  }, 
  {
    timestamps: true
  }
);

//Export model
module.exports = mongoose.model('Joke', JokeSchema);