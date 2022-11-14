const config = require("../knexfile");
const knex = require("knex")(config);

const setupExpressServer = () => {
  const express = require("express");
  const app = express();

  const router = express.Router();

  app.use(express.json());
  app.use(express.Router());

  app.get("/tasks", (req, res) => {
    selectAllData().then((result) => res.send(result));
  });

  app.post("/tasks", (req, res) => {
    knex
      .insert({
        task: req.body.task,
        end_date: req.body.endDate,
        created_at: req.body.createdAt,
        updated_at: req.body.updatedAt,
      })
      .into("tasks")
      .then(() => {
        selectAllData().then((result) => res.send(result));
      });
  });

  app.delete("/tasks", (req, res) => {
    knex
      .where({ id: req.body.id })
      .from("tasks")
      .del()
      .then(() => {
        selectAllData().then((result) => res.send(result));
      });
  });

  app.put("/tasks", (req, res) => {
    knex("tasks")
      .where("id", "=", req.body.id)
      .update({
        task: req.body.task,
        end_date: req.body.endDate,
        updated_at: req.body.updatedAt,
      })
      .then(() => {
        selectAllData().then((result) => res.send(result));
      });
  });

  return app;
};

function selectAllData() {
  return knex
    .select({
      id: "id",
      task: "task",
      endDate: knex.raw("to_char(end_date, 'yyyy-mm-dd')"),
      createdAt: knex.raw("to_char(created_at, 'yyyy-mm-dd')"),
      updatedAt: knex.raw("to_char(updated_at, 'yyyy-mm-dd')"),
    })
    .orderBy("id")
    .from("tasks");
}

module.exports = setupExpressServer;
