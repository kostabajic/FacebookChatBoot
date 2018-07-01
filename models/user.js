var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(
  {
    fbid: {type: String, required: true, max: 100},
    message: {type: String, required: true, max: 100},
    is_aktive:{type: Number, max: 1 }
  }, 
  {
    timestamps: true
  }
);

//Export model
module.exports = mongoose.model('User', UserSchema);
