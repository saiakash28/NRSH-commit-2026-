const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function test() {
  const db = await open({
    filename: path.join(__dirname, 'server', 'database.sqlite'),
    driver: sqlite3.Database
  });

  const tips = await db.all('SELECT id, title, author FROM tips');
  console.log('TIPS IN SQLITE:', tips);
}

test();
