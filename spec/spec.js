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

  before(async () => {
    await knex.from("tasks").del().catch(console.error);
    await knex.raw("SELECT setval('tasks_id_seq', 1, false)");
    await knex("tasks").insert([
      {
        task: "test",
        end_date: "2022-11-11",
        created_at: "2022-11-01",
        updated_at: "2022-11-10",
      },
      {
        task: "Hi!!",
        end_date: "2022-11-11",
        created_at: "2022-11-01",
        updated_at: "2022-11-10",
      }
    ]);
  });

  describe("GET /tasks return tasks", () => {
    it("should return all tasks", async () => {      
      const res = await request.get("/tasks");
      res.body.should.deep.ordered.members([
        {
          "id": 1,
          "task": "test",
          "endDate": "2022-11-11",
          "createdAt": "2022-11-01",
          "updatedAt": "2022-11-10",
        },
        {
          "id": 2,
          "task": "Hi!!",
          "endDate": "2022-11-11",
          "createdAt": "2022-11-01",
          "updatedAt": "2022-11-10",
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
        endDate: "2022-11-01",
        createdAt: "2022-11-01",
        updatedAt: "2022-11-01"
      }

      // POST実行
      const resInsert = await request.post("/tasks").send(expected);
      JSON.parse(resInsert.text).length.should.equal(countBeforeInsertData + 1);
      JSON.parse(resInsert.text)[countBeforeInsertData].task.should.include(expected.task);
    })
  })

  describe("DELETE /tasks delete data when given id match tasks record", () => {
    it("should delete data when given id match tasks's id", async () => {
      const insertData = {
        task: "DELETE test",
        endDate: "2022-11-01",
        createdAt: "2022-11-01",
        updatedAt: "2022-11-01"
      };

      // テスト前のDBレコード件数確認
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

  describe("PUT /tasks update data by given data when id match", () => {
    it("should update task, end_date, updated_at", async () => {
      putData = {
        id: 1,
        task: "PUT test",
        endDate: "2022-12-31",
        updatedAt: "2022-12-01"
      };

      const beforeUpdateData = await request.get("/tasks");
      
      const res = await request.put("/tasks").send(putData);
      let updatedTaskData = {};
      for (const i in JSON.parse(res.text)) {
        if (JSON.parse(res.text)[i].id === 1) {
          updatedTaskData.id = JSON.parse(res.text)[i].id;
          updatedTaskData.task = JSON.parse(res.text)[i].task;
          updatedTaskData.endDate = JSON.parse(res.text)[i].endDate;
          updatedTaskData.updatedAt = JSON.parse(res.text)[i].updatedAt;            
        }
      }
      updatedTaskData.id.should.equal(putData.id);
      updatedTaskData.task.should.equal(putData.task);
      updatedTaskData.endDate.should.equal(putData.endDate);
      updatedTaskData.updatedAt.should.equal(putData.updatedAt);
    })
  })
});
