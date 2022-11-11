const config = require("../knexfile");
const knex = require("knex")(config);

const setupExpressServer = () => {
  const express = require("express");
  const app = express();

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

  return app;
};

module.exports = setupExpressServer;
