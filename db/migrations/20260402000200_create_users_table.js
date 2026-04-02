exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable("users");
  if (exists) {
    return;
  }

  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.text("email").notNullable().unique();
    table.text("full_name").nullable();
    table.text("firebase_uid").nullable().unique();
    table.text("role").notNullable();
    table
      .integer("company_id")
      .unsigned()
      .references("id")
      .inTable("companies")
      .onDelete("SET NULL");
    table.text("invite_status").notNullable().defaultTo("pending");
    table.timestamp("last_login_at", { useTz: true }).nullable();
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("users");
};
