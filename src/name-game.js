'use strict';

require('dotenv').config();
var SlackBot = require('slackbots');

var bot = new SlackBot({
    token: process.env.SLACK_API_TOKEN,
    name: 'Name Game'
});

// VARIABLES

var guessUser;

// BOT

randomizeUser();

function randomizeUser() {
  bot.getUsers().then(function(data) {
    var users = data.members;
    guessUser = users[Math.floor(Math.random() * users.length)];
    var avatarUrl = guessUser.profile.image_512 || guessUser.profile.image_192;
    post('Who is this?\n' + avatarUrl);
  });
}

function post(text) {
  bot.postMessageToChannel('namegame', text, { icon_emoji: ':cat:', slackbot: false});
}

function check(name) {
  var names = [guessUser.name, guessUser.profile.first_name, guessUser.profile.last_name, guessUser.profile.real_name].map((s) => s.toLowerCase());
  return names.indexOf(name.toLowerCase()) >= 0;
}

function help() {
  return "Commands\n\
  *pass*: Move on to new colleague\n\
  *title*: Show the title\n\
  *cheat*: Show the name\n\
  *help*: Show this help text";
}

// EVENTS

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype === undefined && data.text !== undefined) {
    var words = data.text.replace(/^\s+|\s+$/g, '').split(/\s+/);
    var command = words[0];
    var params = words.splice(1);
    switch(command) {
      case 'help':
        post(help());
        break;
      case 'pass':
        randomizeUser();
        break;
      case 'title':
        post(guessUser.profile.title);
        break;
      case 'cheat':
        post(guessUser.profile.real_name);
        break;
      default:
        if (check(data.text)) {
          randomizeUser();
        } else {
          post('Wrong, try again.');
        }
        break;
    }
  }
});
