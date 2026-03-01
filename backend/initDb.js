const fs = require('fs').promises;
const mysql = require('mysql2/promise');
require('dotenv').config();

async function executeSqlFile(connection, filePath) {
  try {
    // Читаем SQL-скрипт
    const sqlScript = await fs.readFile(filePath, 'utf8');
    
    // Разделяем скрипт на отдельные запросы по символу ';'
    const queries = sqlScript.split(';').filter(query => query.trim() !== '');
    
    // Выполняем каждый запрос
    for (const query of queries) {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        try {
          // Для запросов, которые не поддерживаются в prepared statements,
          // используем query вместо execute
          if (trimmedQuery.startsWith('USE') || 
              trimmedQuery.startsWith('CREATE DATABASE') || 
              trimmedQuery.startsWith('CREATE INDEX')) {
            await connection.query(trimmedQuery);
          } else {
            await connection.execute(trimmedQuery);
          }
        } catch (error) {
          // Игнорируем ошибки дублирования ключей и существующих индексов
          if (error.code !== 'ER_DUP_ENTRY' && 
              error.code !== 'ER_DUP_KEYNAME' && 
              error.code !== 'ER_TABLE_EXISTS_ERROR' &&
              error.code !== 'ER_DUP_INDEX') {
            throw error;
          }
        }
      }
    }
    
    console.log(`✅ SQL-файл ${filePath} успешно выполнен`);
  } catch (error) {
    console.error(`🔴 Ошибка выполнения SQL-файла ${filePath}:`, error.message);
    throw error;
  }
}

async function initDatabase() {
  let connection;
  
  try {
    // Создаем отдельное соединение для инициализации
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    // Создаем базу данных, если она не существует
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ База данных ${process.env.DB_NAME} готова`);
    
    // Закрываем соединение
    await connection.end();
    
    // Создаем новое соединение к конкретной базе данных
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    // Выполняем скрипт создания таблиц
    await executeSqlFile(connection, './init_db.sql');
    
    // Выполняем скрипт заполнения данными
    await executeSqlFile(connection, './seed_db.sql');
    
    console.log('✅ База данных успешно инициализирована');
  } catch (error) {
    console.error('🔴 Ошибка инициализации базы данных:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = initDatabase;