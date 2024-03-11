exports.up = function (knex) {
    return knex.schema.createTable("ingredientes", table => {
        table.increments("id");
        table.string("name").notNullable();
        table.integer("dish_id").references("id").inTable("dish").onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("ingredientes");
};
