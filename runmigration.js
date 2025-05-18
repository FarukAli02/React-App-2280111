const knex = require('knex');
require('dotenv').config();
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

db.raw(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
  .then(() => {
    console.log(`✅ Database '${process.env.DB_NAME}' checked/created`);
    return db.migrate.latest();
  })
  .then(() => {
    console.log('✅ Migrations ran successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Migration error:', err);
    process.exit(1);
  });