exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable("access_requests");
  if (exists) {
    return;
  }

  await knex.schema.createTable("access_requests", (table) => {
    table.increments("id").primary();
    table
      .integer("company_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE");
    table.text("full_name").notNullable();
    table.text("email").notNullable();
    table.text("requested_role").notNullable();
    table.text("team_name").nullable();
    table.text("use_case").notNullable();
    table.text("notes").nullable();
    table.text("status").notNullable().defaultTo("new");
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.index(["company_id", "email"]);
    table.index(["status"]);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("access_requests");
};
