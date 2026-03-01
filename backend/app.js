require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Исправлено: было 'bcrypt'
const path = require('path');
const pool = require('./db'); // mysql2 pool
const initDatabase = require('./initDb'); // Инициализация базы данных

// ---------- Инициализация приложения ----------
const app = express(); // Добавлена инициализация

// ---------- Инициализация базы данных ----------
initDatabase(); // Инициализация базы данных при запуске

// ---------- Middleware ----------
app.use(express.json()); // Парсинг JSON‑тела запросов

// CORS (для разработки)
const cors = require('cors');
app.use(cors());

// ---------- JWT‑мидлware ----------
const getUserId = (token) => jwt.verify(token, process.env.JWT_SECRET).id;
const authOnly = (fn) => async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  try {
    await fn(req, res, getUserId(token));
  } catch (err) { // Добавлен err в catch
    console.error('JWT Error:', err);
    res.status(401).json({ error: 'Неверный токен' });
  }
};
// Экспорт функций для использования в других модулях
module.exports = { authOnly, getUserId };

// ---------- Статические файлы ----------
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// ---------- Корневой маршрут ----------
app.get('/', (req, res) => res.send('Сервер онлайн‑лекций работает! 🎉'));

// ---------- API – список лекций ----------
app.get('/api/lectures', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lectures');
    res.json(rows);
  } catch (err) {
    console.error('🔴 Ошибка БД:', err);
    res.status(500).json({ error: 'Ошибка БД' });
  }
});

// ---------- Auth ----------
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Все поля обязательны' });

    const [rows] = await pool.execute('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (rows.length) return res.status(409).json({ error: 'Пользователь уже существует' });

    const hash = await bcrypt.hash(password, 12);
    await pool.execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash]);

    res.status(201).json({ message: 'Пользователь создан' });
  } catch (err) { // Добавлен err в catch
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Заполните все поля' });

    const [rows] = await pool.execute('SELECT id, password_hash, role FROM users WHERE username = ?', [username]);
    if (!rows.length || !await bcrypt.compare(password, rows[0].password_hash))
      return res.status(401).json({ error: 'Неверный логин или пароль' });

    const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { // Добавлен err в catch
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ---------- Прогресс лекции (защищённый) ----------
app.post('/api/lecture-progress', authOnly(async (req, res, userId) => {
  const { lecture_id } = req.body;
  if (!lecture_id) return res.status(400).json({ error: 'lecture_id обязателен' });

  try {
    await pool.execute(
      `INSERT INTO lecture_progress (user_id, lecture_id, completed)
       VALUES (?, ?, TRUE)
       ON DUPLICATE KEY UPDATE completed = TRUE, viewed_at = CURRENT_TIMESTAMP`,
      [userId, lecture_id]
    );
    res.json({ message: 'Прогресс записан' });
  } catch (err) {
    console.error('Progress Error:', err);
    res.status(500).json({ error: 'Ошибка записи прогресса' });
  }
}));

// ---------- Защищённый тест ----------
app.get('/api/protected', authOnly(async (req, res, userId) => {
  res.json({ message: 'Доступ разрешён', user: { id: userId } });
}));

// ---------- Маршруты для работы с тестами ----------
const testRoutes = require('./routes/tests');
app.use('/', testRoutes);
// Экспорт функций для использования в других модулях
module.exports = { authOnly, getUserId };
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Сервер на http://localhost:${port}`));
