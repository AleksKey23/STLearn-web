const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../db');
require('dotenv').config();

// Регистрация
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Все поля обязательны' });

  try {
    const [rows] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (rows.length) return res.status(409).json({ error: 'Пользователь уже существует' });

    const hash = await bcrypt.hash(password, 12);
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    res.status(201).json({ message: 'Пользователь создан' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Логин
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Заполните логин и пароль' });

  try {
    const [rows] = await db.query(
      'SELECT id, password_hash, role FROM users WHERE username = ?',
      [username]
    );
    if (!rows.length) return res.status(401).json({ error: 'Неверный логин или пароль' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
  
});

app.listen(5000, () => {
  console.log('Сервер на http://localhost:5000');
});

module.exports = router;
