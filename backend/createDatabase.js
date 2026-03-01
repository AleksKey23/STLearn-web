const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  let connection;
  
  try {
    // Создаем соединение без указания базы данных
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    // Создаем базу данных, если она не существует
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ База данных ${process.env.DB_NAME} создана или уже существует`);
  } catch (error) {
    console.error('🔴 Ошибка создания базы данных:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Выполняем функцию, если файл запущен напрямую
if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;