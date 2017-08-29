'use strict';

/*
This is a simple wesite backend for testing 
subscription and notification push function 
based on node.js and express.

The core function of notification push is wrapped
in the following code snippet app.post().

To learn more details about google's subscription 
and notification function, please refer to:
    https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/

*/

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();

// Parse JSON body
app.use(bodyParser.json());

app.post('/api/send-push-msg', (req, res) => {
  const options = {
    vapidDetails: {
      subject: 'https://www.baidu.com',
      publicKey: req.body.applicationKeys.public,
      privateKey: req.body.applicationKeys.private
    },
    // 1 hour in seconds.
    TTL: 60 * 60
  };

  webpush.sendNotification(
    req.body.subscription,
    req.body.data,
    options
  )
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      if (err.statusCode) {
        res.status(err.statusCode).send(err.body);
      } else {
        res.status(400).send(err.message);
      }
    });
});

app.use('/', express.static('static'));

// Start the server
const server = app.listen('3000', () => {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening on host: %s, port: %s', host, port);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
