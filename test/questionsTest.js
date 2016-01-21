/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require("request");
var expect = require('chai').expect;

describe("Persistent Node qa Server", function(done) {
  var dbConnection;

  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: "root",
      password: "",
      database: "qa"
    });
    dbConnection.connect();

    var tablename = "sessions";

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: 
     * use: drop table _NAME_OF_TABLE_ */
    dbConnection.query("delete from " + tablename, function (err, r) {
      if (err) throw err;
      done();
    });

    
  });

  afterEach(function() {
    dbConnection.end();
  });

  /*
  * 1. Create a question.
  * QA questions must have a qa_id, a text, and an asked_by_name.
  * POST /question/qa_id:
  */
  it("Should insert posted qa question to the DB", function(done) {
    var id;
    // Post the user to the qa server.
    request({ method: "POST",
              uri: "http://localhost:8080/qa",
              json: { 
                      host_name: "Victoria", 
                      start_time: "Monday 12pm",
                      end_time: "Monday 1pm" 
                    }
    }, function (err, res, body) {
      if (err) console.error("EROOR is:", err);
      // console.log("BODY is:", body);
      id = body.id;
      request({ method: "POST",
                uri: "http://localhost:8080/question/" + body.id,
                json: { 
                        text: "What is your favorite test?", 
                        asked_by_name: "num1fan",
                        qa_id: id
                      }
      }, function (err, res, body) {
        if (err) console.err("EROOR is:", err);
        // console.log("BODY is:", body);
        var queryString = "SELECT * FROM questions;";
        var queryArgs = [];
        dbConnection.query(queryString, function(err, results) {

          if (err) throw err;
          console.log("results:", results);

          // Should have one result:
          expect(results.length).to.equal(1);
          expect(results[0].asked_by_name).to.equal("num1fan");
          expect(results[0].text).to.equal("What is your favorite test?");
          expect(results[0].sessionId).to.equal(id);

          done();
        });
      });
    });
  });

  /*
  * 1. Retrieve all questions.
  * QA questions must be retrieved by qa_id.
  * GET /qa/qa_id:/question
  */
  it("Should retrieve all questions from the DB", function(done) {
    var id;
    // Post the user to the qa server.
    request({ method: "POST",
              uri: "http://localhost:8080/qa",
              json: { 
                      host_name: "Victoria", 
                      start_time: "Monday 12pm",
                      end_time: "Monday 1pm" 
                    }
    }, function (err, res, body) {
      if (err) console.error("EROOR is:", err);
      // console.log("BODY is:", body);
      id = body.id;
      request({ method: "POST",
                uri: "http://localhost:8080/question/" + id,
                json: { 
                        text: "What is your favorite question?", 
                        asked_by_name: "num1fan",
                        qa_id: id
                      }
      }, function (err, res, body) {
        if (err) console.err("EROOR is:", err);
        // console.log("BODY is:", body);
        request({ method: "POST",
                  uri: "http://localhost:8080/question/" + id,
                  json: { 
                          text: "What is your second favorite question?", 
                          asked_by_name: "fanNum2",
                          qa_id: id
                        }
        }, function (err, res, body) {
          if (err) console.err("EROOR is:", err);
          // console.log("BODY is:", body);
          request({ method: "POST",
              uri: "http://localhost:8080/question/" + id,
              json: { 
                      text: "What is your third favorite question?", 
                      asked_by_name: "fanNum3",
                      qa_id: id
                    }
          }, function (err, res, body) {
            if (err) console.err("EROOR is:", err);
            // console.log("BODY is:", body);
            request({ method: "GET",
                      uri: "http://localhost:8080/qa/" + id + "/questions/" + undefined
            }, function (err, res, body) {
              if (err) console.err("EROOR is:", err);
              // console.log("BODY is:", body);
              var data = JSON.parse(body);
              // Should have two results:
              expect(data.length).to.equal(3);
              // expect(data[0].asked_by_name).to.equal("num1fan");
              done();
            });
          });
        });
      });
    });
  });

});