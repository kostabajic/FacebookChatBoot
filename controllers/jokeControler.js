'use strict';

var mongoose = require('mongoose');
var DateDiff = require('date-diff');
var Joke = require('../models/joke.js');
require('dotenv').load();
const WAIT_FOR_FIRST_JOKE=process.env.WAIT_FOR_FIRST_JOKE;
const SEND_JOKE=process.env.SEND_JOKE;
const WAIT_24=process.env.WAIT_24;

/* create new active joke for user */
exports.create_a_joke=function(fbid, message) {
  return new Promise((resolve, reject) => {
    Joke.create({"user_id":fbid,"message":message,"is_aktive": 1})
    .then(res => { // Success
      resolve(res);
    });
  })
  .then(res => { // Success
    return res.message;
  });
}

/* search for user active jokes end checking time and number */
exports.find_by_fb_id= function(user_id) {
  return new Promise((resolve, reject) => {
    var query = Joke.find({'user_id': user_id,"is_aktive": 1})
    .sort([['updatedAt', 'descending']]);
    query.exec( function(err, jokes) {
        if (err)
          console.log(err);
        if(jokes.length==0)
          resolve(WAIT_FOR_FIRST_JOKE);
        else{
          let diff=Date.diff( new Date(),new Date(jokes[0].createdAt)).hours();
          if (jokes.length % 10==0)
            if(diff<1)
              resolve(WAIT_24);
            else
              resolve(SEND_JOKE);
          else
            resolve(SEND_JOKE);
        }
    });
  });
};

/* reset all user active jokes */
exports.reset=function(fbid) {
  Joke.update({ fbid: fbid,is_aktive:1 }, { $set: { is_aktive: 0 }}, {multi: true},  function(){});
}  