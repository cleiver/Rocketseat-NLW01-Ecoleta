import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable(
    "collection_centers_recycling_types",
    (table) => {
      table.increments("id").primary();
      table
        .integer("collection_center_id")
        .notNullable()
        .references("id")
        .inTable("collection_centers");
      table
        .integer("recycling_type_id")
        .notNullable()
        .references("id")
        .inTable("recycling_types");
    }
  );
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("collection_centers_recycling_types");
}
