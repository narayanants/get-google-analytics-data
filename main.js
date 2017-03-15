'use strict';

var express = require('express');
var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
var analytics = google.analytics('v3');

var app = express();

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '<CLIENT_ID>';
var CLIENT_SECRET = '<CLIENT_SECRET>';
var REDIRECT_URL = '<REDIRECT_URL>';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


var getAccessToken = function (oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/analytics.readonly' // can be a space-delimited string or an array of scopes
  });
  console.log('Visit the url: ', url);
};

app.get('/oauth2callback',function(req,res){
    var code = req.query.code;
    console.log(code);
    oauth2Client.getToken(code, function (err, tokens) {
    if (err) {
      //return callback(err);
    }
    // set tokens to the client
    // TODO: tokens should be set by OAuth2 client.
    oauth2Client.setCredentials(tokens);
analytics.data.ga.get({
        auth:oauth2Client,
        'dimensions':'ga:userType,ga:sessionCount',
        'start-date':'30daysAgo',
        'end-date':'today',
        'ids':'<IDs>',
        'metrics':'ga:newUsers' 
      },function(err,response){
        console.log(err);
        console.log(response);
        if(!err){
          res.json(response);
        }
      });
    //callback();
  });
});
// retrieve an access token
getAccessToken(oauth2Client, function () {
  // retrieve user profile
  console.log("done")
});

app.listen(3000,function(){
    console.log('App is running on port 3000');
});

module.exports = app;