import db from './connect';

async function reset() {
  // Drop tables (works in Postgres)
  await db.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

  console.info('Database reset complete!');
}

reset();
