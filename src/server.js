const config = require("../knexfile");
const knex = require("knex")(config);

const setupExpressServer = () => {
  const express = require("express");
  const app = express();

  app.use(express.json());

  app.get("/tasks", (req, res) => {
    knex
      .select({
        id: "id",
        task: "task",
        endDate: knex.raw("to_char(end_date, 'yyyy-mm-dd')"),
        createdAt: knex.raw("to_char(created_at, 'yyyy-mm-dd')"),
        updatedAt: knex.raw("to_char(updated_at, 'yyyy-mm-dd')"),
      })
      .orderBy("id")
      .from("tasks")
      .then((result) => {
        res.send(result);
      });
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
        knex
          .select({
            id: "id",
            task: "task",
            endDate: knex.raw("to_char(end_date, 'yyyy-mm-dd')"),
            createdAt: knex.raw("to_char(created_at, 'yyyy-mm-dd')"),
            updatedAt: knex.raw("to_char(updated_at, 'yyyy-mm-dd')"),
          })
          .from("tasks")
          .then((result) => {
            res.send(result);
          });
      });
  });

  app.delete("/tasks", (req, res) => {
    knex
      .where({ id: req.body.id })
      .from("tasks")
      .del()
      .then(() => {
        knex
          .select({
            id: "id",
            task: "task",
            endDate: knex.raw("to_char(end_date, 'yyyy-mm-dd')"),
            createdAt: knex.raw("to_char(created_at, 'yyyy-mm-dd')"),
            updatedAt: knex.raw("to_char(updated_at, 'yyyy-mm-dd')"),
          })
          .from("tasks")
          .then((result) => {
            res.send(result);
          });
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
        knex
          .select({
            id: "id",
            task: "task",
            endDate: knex.raw("to_char(end_date, 'yyyy-mm-dd')"),
            createdAt: knex.raw("to_char(created_at, 'yyyy-mm-dd')"),
            updatedAt: knex.raw("to_char(updated_at, 'yyyy-mm-dd')"),
          })
          .from("tasks")
          .then((result) => {
            res.send(result);
          });
      });
  });

  return app;
};

module.exports = setupExpressServer;
