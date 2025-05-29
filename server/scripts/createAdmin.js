require('dotenv').config({ path: __dirname + '/../.env' });
const bcrypt = require('bcrypt');
const mysql  = require('mysql2/promise');

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: node createAdmin.js <username> <password>');
    process.exit(1);
  }

  // 1) Хешируем заданный пароль
  const hash = await bcrypt.hash(password, 12);

  // 2) Подключаемся к БД с параметрами из .env
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  // 3) Создаём нового админа
  await conn.execute(
    `INSERT INTO users (name, password, role)
       VALUES (?, ?, 'admin')`,
    [username, hash]
  );
  console.log(`Admin user "${username}" created.`);
  await conn.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
