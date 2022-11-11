const setupExpressServer = require("../src/server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { object } = require("underscore");
chai.use(chaiHttp);
chai.should();

const app = setupExpressServer();

describe("The express server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(app);
  });

  describe("GET /tasks return tasks", () => {
    it("should return all tasks", async () => {
      const res = await request.get("/tasks");
      JSON.parse(res.text).length.should.equal(2)
      JSON.parse(res.text).should.deep.equal([
        {
          "id": 1,
          "task": "test",
          "endDate": "2022-11-10T15:00:00.000Z",
          "createdAt": "2022-10-31T15:00:00.000Z",
          "updatedAt": "2022-11-09T15:00:00.000Z",
        },
        {
          "id": 2,
          "task": "Hi!!",
          "endDate": "2022-11-10T15:00:00.000Z",
          "createdAt": "2022-10-31T15:00:00.000Z",
          "updatedAt": "2022-11-09T15:00:00.000Z",
        },
      ]);
    });
  });
});
