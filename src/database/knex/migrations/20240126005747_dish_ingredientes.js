
exports.up = knex => knex.schema.createTable("ingredientes", table => {
    table.increments("id");
    table.integer("dish_id").references("id").inTable("dish").onDelete('CASCADE');
    table.integer("user_id").references("id").inTable("users");

    table.text("name");


});

exports.down = knex => knex.schema.dropTable("ingredientes", table => {


})
