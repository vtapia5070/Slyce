// This file queries the database to save and retrieve questions

var Questions = require('../config.js').Questions;
var Sessions = require('./sessions.js');
var Answers = require('./answers.js');
var answers = require('../config.js').Answers;
var Promises = require('bluebird');

module.exports = {
  // method to save questions
  saveQuestion: function (num, data, cb) {
    Sessions.retrieveSession(num, function (sessionData) {
      data.sessionId = sessionData.id;
      data.answered = "false";
      Questions.create(data)
        .then(function (result) {
          cb(result.dataValues);
        }).catch(function (err) {
          console.log("Error in questions.js", err);
        });
    });
  },
  retrieveQuestions: function (num, cb) {
    Questions.findAll({where: {sessionId: num} })
      .then(function (list){
        var results = [];
        list.forEach(function (i) {
          results.push(i.dataValues);
        });
        cb(results, results.length);
      }).catch(function (err) {
        cb("Are you sure "+ num + " is the correct qa_id?");
      });
  },
  getAnsweredQuestions: function (num, cb) {
    module.exports.retrieveQuestions(num, function (data, length) {
      var filteredList = [];
      var counter = 0;
      for (var i = 0; i <= data.length; i++) {
        (function (i) {
          if (data[i] && data[i].answered === "true") {
            Answers.getAnswers(data[i].id, function (answer) {
              data[i].answer = answer;
              filteredList.push(data[i]);
              counter++;
              if (counter === data.length) {
                cb(filteredList);
              }
            });
          } else {
            counter++;
          }
        })(i);
      }
    });
  },
  getAllQuestions: function (num, cb) {
    this.getAnsweredQuestions(num, function (list) {
      Questions.findAll({where: {answered: "false"}})
      .then(function (questions) {
        var newList = questions.concat(list);
        cb(newList);
      }).catch();
    });
  },
  getUnansweredQuestions: function (num, cb) {
    Questions.findAll({where: {answered: "false"}})
    .then(function (questions) {
      cb(questions);
    }).catch();
  }
};

