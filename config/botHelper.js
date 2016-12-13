var tokens = require('./accessTokens.js');
var request = require('request');

var sendMessage = function(event) {
  var messagePacket = {
    "bot_id": tokens.botId,
    "text": messageCreator(event)
  };
  var options = {
    url: "https://api.groupme.com/v3/bots/post",
    headers: JSON.stringify({"Content-Type": "application/json"}),
    method: 'POST',
    body: JSON.stringify(messagePacket)
  };
  request(options, function (err, httpResp, body) {
    if (!err && httpResp.statusCode == 200) {
      console.log('message successfully sent');
    } else {
      if (err) {
        console.log('err');
      } else {
        console.log("The status code is " + httpResp.statusCode);
      }
    }
  });
};

var messageCreator = function(event) {
  var message = event.creator.firstName + " wants you to know that the event ";
  message = message + event.title + " is happening right now! ";
  message = message + "It is happening at " + event.location;
  return message;
}

module.exports = sendMessage;