exports.up = knex => knex.schema.createTable("dish", table => {
    table.increments("id");
    table.text("imagem");
    table.text("name");
    table.decimal("preco", 10, 2);
    table.text("descricao");
    table.string("ingredientes");
    table.enu("categoria", ['Entrada', 'Pratos Principais', 'Bebidas Principais']).notNullable();
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dish", table => {


});
