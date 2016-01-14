// This module requires database controllers to respond to request-handler.js with json

var sessions = require('./controllers/sessions.js');
var questions = require('./controllers/questions.js');
var answers = require('./controllers/answers.js');


module.exports = {
  sessions: {
    post: function (data, cb) {
      //query sessions db to saveData, pass in callback
      sessions.saveSession(data, function (sessionsData) {
        cb(sessionsData);
      }); 
    },
    get: function (data, cb) {
      // get a qa session
      sessions.retrieveSession(data, function (sessionInfo){
        cb(sessionInfo);
      });
    }
  },
  questions: {
    get: function (filtered, num, cb) {
      if (filtered) {
        questions.getUnansweredQuestions(num, function (questionsList) {
          cb(questionsList);
        });
      } else {
        console.log("calling getAllQuestions");
        questions.getAllQuestions(num, function (questionsList){
          cb(questionsList);
        });
      }
    },
    post: function (num, question, cb) {    
      questions.saveQuestion(num, question, function (questionInfo) {
        cb(questionInfo);
      });
    }
  },
  answers: {
    get: function (req, res) {
    },
    post: function (questionId, data, cb) {
      answers.saveAnswer(questionId, data, function (answerInfo) {
        cb(answerInfo);
      });
    }
  }
};