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
        endDate: "end_date",
        createdAt: "created_at",
        updatedAt: "updated_at",
      })
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
            endDate: "end_date",
            createdAt: "created_at",
            updatedAt: "updated_at",
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
            endDate: "end_date",
            createdAt: "created_at",
            updatedAt: "updated_at",
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
