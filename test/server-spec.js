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
  * 1. Create a QA session.
  * QA sessions must have a host user, a start_time, and an end_time.
  * POST /qa
  */
  it("Should insert posted qa sessions to the DB", function(done) {
    // Post the user to the qa server.
    request({ method: "POST",
              uri: "http://localhost:8080/qa",
              json: { 
                      host_name: "Victoria", 
                      start_time: "Monday 12pm",
                      end_time: "Monday 1pm" 
                    }
    }, function (error, response, body) {
      if (error) console.error('upload failed:', error);
      console.log('Upload successful!  Server responded with:', body);
      console.log("after request");
      // Now if we look in the database, we should find the
      // posted qa sesison there.

      // TODO: You might have to change this test to get all the data from
      // sessions table, since this is schema-dependent.
      var queryString = "SELECT * FROM sessions;";
      var queryArgs = [];
      dbConnection.query(queryString, function(err, results) {

        if (err) throw err;
        console.log("results:", results);

        // Should have one result:
        expect(results.length).to.equal(1);
        expect(results[0].host_name).to.equal("Victoria");
        expect(results[0].start_time).to.equal("Monday 12pm");
        expect(results[0].end_time).to.equal("Monday 1pm");

        done();
      });
    });
  });
  
  /*
  * 1. Retrieve a QA session.
  * QA sessions request must have a qa_id.
  * Get /qa/:qa_id
  */
  it("Should retrieve qa session from the DB", function(done) {
    var sessionId;
    console.log("retrieving qa session");
    // var queryString = "SELECT * FROM sessions WHERE id = " + sessionId + ";";
    request({ method: "POST",
              uri: "http://localhost:8080/qa",
              json: { 
                      host_name: "Victoria", 
                      start_time: "Monday 12pm",
                      end_time: "Monday 1pm" 
                    }
    }, function (error, response, body) {
      if (error) console.error('upload failed:', error);
      console.log('Upload successful!  Server responded with:', body);
      sessionId = body.id;

      request({ method: "GET",
                uri: "http://localhost:8080/qa/" + sessionId
      },  function(error, response, body) {
        if (error) console.error('upload failed:', error);
        console.log('Upload successful!  Server responded with:', body);

        var sessionsLog = JSON.parse(body);

        console.log(sessionsLog);
        expect(sessionsLog.id).to.equal(sessionId);
        expect(sessionsLog.host_name).to.equal("Victoria");
        expect(sessionsLog.start_time).to.equal("Monday 12pm");
        expect(sessionsLog.end_time).to.equal("Monday 1pm");

        done();
      });
    });
  });

});
