exports.seed = async function seed(knex) {
  const existing = await knex("companies").where({ slug: "example-company" }).first();
  if (existing) {
    return;
  }

  await knex("companies").insert({
    name: "Example Company",
    slug: "example-company",
    dashboard_key: "example-company",
    status: "active",
    branding_json: {
      theme: "teal-copper"
    }
  });
};
