const setupExpressServer = require("../src/server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { object } = require("underscore");
const { config } = require("dotenv");
chai.use(chaiHttp);
chai.should();
const configKnex = require("../knexfile");
const knex = require("knex")(configKnex);

const app = setupExpressServer();

describe("The express server", () => {
  let request;
  beforeEach(async () => {
    request = chai.request(app).keepOpen();
    await knex.from("tasks").where('id', '>', 2).del().catch(console.error);
    await knex.raw("SELECT setval('tasks_id_seq', 2)")
  });

  describe("GET /tasks return tasks", () => {
    it("should return all tasks", async () => {
      const res = await request.get("/tasks");
      res.body.should.deep.ordered.members([
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
        }
      ]);
    });
  });

  describe("POST /tasks insert task", () => {
    it("should insert data to tasks", async () => {
      const resSelect = await request.get("/tasks");
      const countBeforeInsertData = JSON.parse(resSelect.text).length
      const expected = {
        task: "POST test",
        endDate: "2022-11-10T15:00:00.000Z",
        createdAt: "2022-11-10T15:00:00.000Z",
        updatedAt: "2022-11-10T15:00:00.000Z"
      }
      const resInsert = await request.post("/tasks").send(expected);
      JSON.parse(resInsert.text).length.should.equal(countBeforeInsertData + 1);
      JSON.parse(resInsert.text)[countBeforeInsertData].task.should.include(expected.task);
    })
  })
});
