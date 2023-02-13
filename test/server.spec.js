// Imports the server.js file to be tested.
const server = require("../server");
// Assertion (Test Driven Development) and Should,  Expect(Behaviour driven 
// development) library
const chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe("Server!", () => {
    it("Confirms that the default path is working", (done) => {
        chai
          .request(server)
          .get("/")
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
      });

    it("Confirms that the search history endpoint is working.", (done) => {
    chai
        .request(server)
        .get("/search_history")
        .end((err, res) => {
        expect(res).to.have.status(200);
        done();
        });
    });
});