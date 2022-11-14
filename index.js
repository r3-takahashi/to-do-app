// const setupExpressServer = require("./server");
const express = require("express");

const PORT = process.env.PORT || 3000;
// const app = setupExpressServer();
const app = express();
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

const config = require("../knexfile");
const knex = require("knex")(config);

app.get("/tasks", (req, res) => {
  selectAllData().then((result) => res.send(result));
});

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
