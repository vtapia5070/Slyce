// this file handles all request and routings and utilizes models.js 

var fs = require('fs');
var path = require('path');
var models = require('./db/models.js');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

var sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var getData = function (request, callback) {
  var body = "";
  request.on("data", function (chunk) {
    body += chunk;
  });
  request.on("end", function () {
    callback(JSON.parse(body));
  });
};

var postRoutes = {
  '/qa' : function (request, response) {
    getData(request, function (data) {
      models.sessions.post(data, function (jsonObj) {
        sendResponse(response, jsonObj);
      });
    });
  },
  'question': function (request, response, qaId) {
    getData(request, function (question) {
      models.questions.post(qaId, question, function (jsonObj) {
        sendResponse(response, jsonObj);
      });
    });
  },
  'answer': function (request, response, questionId) {
    getData(request, function (data) {
      models.answers.post(questionId, data, function (jsonObj) {
        sendResponse(response, jsonObj);
      });
    });
  }
};

getRoutes = {
  'sessions': function (qaId, response) {
    models.sessions.get(qaId, function (jsonObj) {
      sendResponse(response, jsonObj);
    });
  },
  'questions': function (answeredQuestions, qaId, response) {
    models.questions.get(answeredQuestions, qaId, function (questions) {
      sendResponse(response, questions);
    });
  }
};

var sendError = function (response) {
  sendResponse(response, JSON.stringify("Invalid request"), 404);
};

module.exports = function (request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var url = request.url.split('/');
  if (request.method === "POST") {
    if (postRoutes[request.url]){
      postRoutes[request.url](request, response);
    } else {
      if (url[1] === "question") {
        postRoutes.question(request, response, JSON.parse(url[2]));
      } else if (url[1] === "answer") {
        postRoutes.answer(request, response, JSON.parse(url[2]));
      } else {
        sendError(response);
      }
    }
  } else if (request.method === "GET") {
    console.log(url);
    if (url.length === 3) {
      getRoutes.sessions(JSON.parse(url[2]), response);
    } else if (url.length === 5 && url[3] === "questions") {
      if (url[4] === "false" || url[4] === "undefined") {
        url[4] = false;
      } else {
        url[4] = true;
      }
      getRoutes.questions(url[4], JSON.parse(url[2]), response);
    } else {
      sendError(response);
    }
  }
};
