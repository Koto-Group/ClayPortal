exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable("user_invites");
  if (exists) {
    return;
  }

  await knex.schema.createTable("user_invites", (table) => {
    table.increments("id").primary();
    table
      .integer("company_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE");
    table.text("email").notNullable();
    table.text("role").notNullable();
    table.text("token_hash").notNullable().unique();
    table.timestamp("expires_at", { useTz: true }).notNullable();
    table.timestamp("accepted_at", { useTz: true }).nullable();
    table
      .integer("invited_by_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.index(["company_id", "email"]);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("user_invites");
};
