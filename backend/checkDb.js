const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  let connection;
  
  try {
    // Создаем соединение с базой данных
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'online_learning'
    });
    
    console.log('✅ Подключение к базе данных успешно');
    
    // Проверяем существование таблиц
    const tables = ['users', 'lectures', 'lecture_progress', 'tests', 'test_questions', 'question_options', 'test_results', 'user_answers'];
    
    console.log('\nПроверка существования таблиц:');
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT 1 FROM ${table} LIMIT 1`);
        console.log(`✅ Таблица ${table} существует`);
      } catch (error) {
        console.log(`❌ Таблица ${table} не существует или недоступна: ${error.message}`);
      }
    }
    
    // Проверяем количество записей в таблицах
    console.log('\nКоличество записей в таблицах:');
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`Таблица ${table}: ${rows[0].count} записей`);
      } catch (error) {
        console.log(`Таблица ${table}: ошибка подсчета записей - ${error.message}`);
      }
    }
    
    // Проверяем структуру таблицы lectures
    console.log('\nСтруктура таблицы lectures:');
    try {
      const [rows] = await connection.execute('DESCRIBE lectures');
      console.log('Поля таблицы lectures:');
      rows.forEach(row => {
        console.log(`  ${row.Field}: ${row.Type} ${row.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${row.Key} ${row.Default ? `DEFAULT ${row.Default}` : ''}`);
      });
    } catch (error) {
      console.log(`Ошибка получения структуры таблицы lectures: ${error.message}`);
    }
    
  } catch (error) {
    console.error('🔴 Ошибка проверки базы данных:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Выполняем функцию, если файл запущен напрямую
if (require.main === module) {
  checkDatabase();
}

module.exports = checkDatabase;