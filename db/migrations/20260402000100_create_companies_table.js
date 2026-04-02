exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable("companies");
  if (exists) {
    return;
  }

  await knex.schema.createTable("companies", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("slug").notNullable().unique();
    table.text("dashboard_key").notNullable();
    table.text("status").notNullable().defaultTo("active");
    table.jsonb("branding_json").nullable();
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("companies");
};
