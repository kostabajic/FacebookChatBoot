var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var request = require('request-promise');
var Promise = require('promise');
var mongoose = require('mongoose');
var user=require('../controllers/userControler');
var joke=require('../controllers/jokeControler');
require('dotenv').load();
  
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const HUB_VERIFY_TOKEN = process.env.HUB_VERIFY_TOKEN;
const WAIT_FOR_FIRST_JOKE=process.env.WAIT_FOR_FIRST_JOKE;
const SEND_JOKE=process.env.SEND_JOKE;
const WAIT_24=process.env.WAIT_24;

/* For Facebook Validation */
router.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === HUB_VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
});

/* Handling all messenges */
router.post('/webhook', (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      if(entry.messaging)
        entry.messaging.forEach((event) => {
          if(event)
            if (event.message && event.message.text)
              if (event.message.text=="new joke")
                check_response(event.sender.id, event.message.text);
              else
                send_message(event.sender.id,"Type: new joke");
            else if (event.postback && event.postback.payload) 
              user.reset(event.sender.id, event.postback.payload);  
        });
    });
    res.status(200).end();
  }
});

/* Check which type of response to send */
function check_response(sender, message){
  let checkUser = ()=>{
    return new Promise((resolve, reject) => { 
        user.check_for_joke(sender, message)
        .then(res => {
            resolve(res);
        });
    });
  }
  checkUser()
  .then(check_result => {
    if(check_result==SEND_JOKE)
      request({
          "method":"GET", 
          "uri": "http://api.icndb.com/jokes/random",
          "json": true,
          "headers": {
            "User-Agent": "Chuck bot"
          }
      })
      .then(function(fulfilled_body) {
          joke.create_a_joke(sender,fulfilled_body.value.joke)
          .then(
            joke_text => { // Success
              send_message(sender,joke_text)
            }
          );
        }, function(rejected_body){
          console.log(rejected_body);
      })
    if(check_result==WAIT_FOR_FIRST_JOKE)
    send_reset(sender,"Wait for first joke");
    if(check_result==WAIT_24)
    send_reset(sender,'Wait for 24 hours');
  },reason=> {
      console.error('Something went wrong', reason);
  }); 
} 

/* Sending message to sender */
function send_message(sender,text) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}

function send_reset(sender,text){
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message:{
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: text,
            buttons: [{
              type: 'postback',
              title: 'Reset',
              payload: 'reset'
            }]
          }  
        }
      }
    }
  }, function (error, response) {
    if (error) {
        console.log('Error sending message: ', error);
    } else if (response.body.error) {
        console.log('Error: ', response.body.error);
    }
  });
}
module.exports=router;
