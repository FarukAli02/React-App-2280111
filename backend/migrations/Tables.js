exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.timestamps(true, true);
    })
    .createTable('categories', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('note');
      table.timestamps(true, true);
    })
    .createTable('products', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('inventory', function (table) {
      table.increments('id').primary();
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
      table.integer('quantity').notNullable();
      table.string('location').notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('inventory')
    .dropTableIfExists('products')
    .dropTableIfExists('categories')
    .dropTableIfExists('users');
};
