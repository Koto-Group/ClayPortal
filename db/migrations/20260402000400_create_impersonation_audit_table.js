exports.up = async function up(knex) {
  const exists = await knex.schema.hasTable("impersonation_audit");
  if (exists) {
    return;
  }

  await knex.schema.createTable("impersonation_audit", (table) => {
    table.increments("id").primary();
    table
      .integer("admin_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("target_user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("company_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("companies")
      .onDelete("SET NULL");
    table.timestamp("started_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("ended_at", { useTz: true }).nullable();
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("impersonation_audit");
};
