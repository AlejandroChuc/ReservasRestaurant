const db = require('./db');

db.query('SHOW TABLES', (err, results) => {
  if (err) throw err;
  console.log('Tablas:', results);
  db.end();
});