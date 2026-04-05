exports.seed = async function seed(knex) {
  const companies = [
    {
      name: "Example Company",
      slug: "example-company",
      dashboard_key: "example-company",
      status: "active",
      branding_json: {
        theme: "teal-copper"
      }
    },
    {
      name: "Assembly Studio",
      slug: "assembly",
      dashboard_key: "assembly-studio",
      status: "active",
      branding_json: {
        theme: "sand-graphite"
      }
    },
    {
      name: "Northpeak Ops",
      slug: "northpeak",
      dashboard_key: "northpeak-ops",
      status: "active",
      branding_json: {
        theme: "cobalt-steel"
      }
    },
    {
      name: "Riverline Advisory",
      slug: "riverline",
      dashboard_key: "riverline-advisory",
      status: "active",
      branding_json: {
        theme: "stone-gold"
      }
    }
  ];

  for (const company of companies) {
    const existing = await knex("companies").where({ slug: company.slug }).first();
    if (existing) {
      continue;
    }

    await knex("companies").insert(company);
  }
};
