/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("tasks").del();
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
};
