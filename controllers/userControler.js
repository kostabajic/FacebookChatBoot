'use strict';

var mongoose = require('mongoose');
var Promise = require('promise');
var User = require('../models/user.js');
var joke=require('./jokeControler');
mongoose.Promise = global.Promise;
require('dotenv').load();
const WAIT_FOR_FIRST_JOKE=process.env.WAIT_FOR_FIRST_JOKE;
const SEND_JOKE=process.env.SEND_JOKE;
const WAIT_24=process.env.WAIT_24;
/* Check if there is an active user if doesn't exist 
create a new one active else check number of  his active jokes
depending of that response message */
exports.check_for_joke=function(fbid, message) {
  return new Promise( (resolve, reject) => {
  //Load the user 
    User.findOne({$query: { fbid: fbid,is_aktive: 1},$orderby: { createdAt: -1 } })
    .exec()
    .then(function(user){
      if(!user)  
          create_a_user(fbid, message)
          .then(() => { // Success
              resolve(SEND_JOKE);
          });    
      else
        joke.find_by_fb_id(user.fbid)
        .then(res => { // Success
            resolve(res);
        });    
    });
  });
}
/* set user reset (is_active=0) and his jokes */
exports.reset=function(fbid, message) {
  User.update({ fbid: fbid ,is_aktive:1}, { $set: { is_aktive: 0,message:message }},{multi: true}, function(fbid){
    joke.reset(fbid);
  })
} 
/* create new active user */ 
function create_a_user(fbid, message) {
  return new Promise((resolve, reject) => {
    User.create({"fbid":fbid,"message":message,"is_aktive": 1})
    .then(res => { // Success
      resolve(res);
    });
  })
  .then(res => { // Success
    return res;
  });
}

