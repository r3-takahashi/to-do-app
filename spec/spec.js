const setupExpressServer = require("../src/server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { object } = require("underscore");
const { config } = require("dotenv");
chai.use(chaiHttp);
chai.should();
const configKnex = require("../knexfile");
const { count } = require("console");
const knex = require("knex")(configKnex);

const app = setupExpressServer();

describe("The express server", () => {
  let request;
  beforeEach(async () => {
    request = chai.request(app).keepOpen();
  });

  describe("GET /tasks return tasks", () => {
    before(async () => {
      await knex.from("tasks").where('id', '>', 2).del().catch(console.error);
      await knex.raw("SELECT setval('tasks_id_seq', 2)")  
    })

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
      // POST前のDB状態を取得
      const resSelect = await request.get("/tasks");
      const countBeforeInsertData = JSON.parse(resSelect.text).length

      const expected = {
        task: "POST test",
        endDate: "2022-11-10T15:00:00.000Z",
        createdAt: "2022-11-10T15:00:00.000Z",
        updatedAt: "2022-11-10T15:00:00.000Z"
      }

      // POST実行
      const resInsert = await request.post("/tasks").send(expected);
      console.log("afterPOST:", JSON.parse(resInsert.text));
      JSON.parse(resInsert.text).length.should.equal(countBeforeInsertData + 1);
      JSON.parse(resInsert.text)[countBeforeInsertData].task.should.include(expected.task);
    })
  })

  describe("DELETE /tasks delete data when given id match tasks record", () => {
    it("should delete data when given id match tasks's id", async () => {
      const insertData = {
        task: "DELETE test",
        endDate: "2022-11-10T15:00:00.000Z",
        createdAt: "2022-11-10T15:00:00.000Z",
        updatedAt: "2022-11-10T15:00:00.000Z"
      };

      // 初期状態のDBレコード件数確認
      const beforeInsertData = await request.get("/tasks");
      const beforeInsertDataLength = JSON.parse(beforeInsertData.text).length;

      // DELETEテスト用のデータを投入
      const resInsert = await request.post("/tasks").send(insertData);
      JSON.parse(resInsert.text).length.should.equal(beforeInsertDataLength + 1);
      const insertId = JSON.parse(resInsert.text)[beforeInsertDataLength].id;

      // DELETE実行
      const afterDeleteData = await request.delete("/tasks").send({ id: JSON.parse(resInsert.text)[beforeInsertDataLength].id});
      JSON.parse(afterDeleteData.text).length.should.equal(beforeInsertDataLength);

      let dataId = [];
      for (const i in JSON.parse(afterDeleteData.text)) {
        dataId.push(JSON.parse(afterDeleteData.text)[i].id);
      };
      dataId.should.not.include(insertId);
    })
  })
});
