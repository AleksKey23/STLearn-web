const express = require('express');
const pool = require('../db');
const { authOnly } = require('../app');

const router = express.Router();

// Получение списка тестов
router.get('/api/tests', authOnly(async (req, res, userId) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tests');
    res.json(rows);
  } catch (err) {
    console.error('Ошибка получения тестов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}));

// Получение вопросов теста
router.get('/api/tests/:testId/questions', authOnly(async (req, res, userId) => {
  const { testId } = req.params;
  
  try {
    // Получаем вопросы теста
    const [questions] = await pool.query(
      'SELECT id, question_text FROM test_questions WHERE test_id = ? ORDER BY id',
      [testId]
    );
    
    // Для каждого вопроса получаем варианты ответов
    for (let question of questions) {
      const [options] = await pool.query(
        'SELECT id, option_text FROM question_options WHERE question_id = ? ORDER BY option_index',
        [question.id]
      );
      question.options = options;
    }
    
    res.json(questions);
  } catch (err) {
    console.error('Ошибка получения вопросов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}));

// Сохранение результатов теста
router.post('/api/test-results', authOnly(async (req, res, userId) => {
  const { test_id, answers } = req.body;
  
  if (!test_id || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Некорректные данные' });
  }
  
  try {
    // Начинаем транзакцию
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Подсчитываем количество правильных ответов
      let correctCount = 0;
      const totalQuestions = answers.length;
      
      // Сохраняем ответы пользователя и проверяем правильность
      for (const answer of answers) {
        const { question_id, selected_option_id } = answer;
        
        // Получаем правильный ответ для вопроса
        const [questionRows] = await connection.query(
          'SELECT correct_answer_index FROM test_questions WHERE id = ?',
          [question_id]
        );
        
        if (questionRows.length === 0) {
          await connection.rollback();
          return res.status(400).json({ error: 'Некорректный вопрос' });
        }
        
        // Получаем индекс выбранного варианта ответа
        const [optionRows] = await connection.query(
          'SELECT option_index FROM question_options WHERE id = ?',
          [selected_option_id]
        );
        
        if (optionRows.length === 0) {
          await connection.rollback();
          return res.status(400).json({ error: 'Некорректный вариант ответа' });
        }
        
        const isCorrect = questionRows[0].correct_answer_index === optionRows[0].option_index;
        if (isCorrect) correctCount++;
        
        // Сохраняем ответ пользователя
        await connection.query(
          `INSERT INTO user_answers (user_id, test_id, question_id, selected_option_id, is_correct)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, test_id, question_id, selected_option_id, isCorrect]
        );
      }
      
      // Вычисляем процент правильных ответов
      const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      
      // Получаем порог прохождения теста
      const [testRows] = await connection.query(
        'SELECT pass_threshold FROM tests WHERE id = ?',
        [test_id]
      );
      
      if (testRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({ error: 'Некорректный тест' });
      }
      
      const passed = percentage >= testRows[0].pass_threshold;
      
      // Сохраняем результаты теста
      const [result] = await connection.query(
        `INSERT INTO test_results (user_id, test_id, score, total_questions, percentage, passed)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, test_id, correctCount, totalQuestions, percentage, passed]
      );
      
      // Завершаем транзакцию
      await connection.commit();
      
      res.json({
        score: correctCount,
        total_questions: totalQuestions,
        percentage,
        passed
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Ошибка сохранения результатов теста:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}));

// Получение результатов теста
router.get('/api/test-results/:testId', authOnly(async (req, res, userId) => {
  const { testId } = req.params;
  
  try {
    const [rows] = await pool.query(
      `SELECT score, total_questions, percentage, passed, completed_at
       FROM test_results
       WHERE user_id = ? AND test_id = ?
       ORDER BY completed_at DESC
       LIMIT 1`,
      [userId, testId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Результаты не найдены' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Ошибка получения результатов теста:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}));

module.exports = router;