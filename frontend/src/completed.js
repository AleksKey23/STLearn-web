// src/completed.js

// Инициализируем completedTests: загружаем из localStorage или создаём пустой объект
let completedTests = {};
const STORAGE_KEY = 'completedTests';

// При загрузке модуля пытаемся загрузить сохранённые данные
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    completedTests = JSON.parse(saved);
  }
} catch (error) {
  console.error('Ошибка при загрузке данных о пройденных тестах:', error);
  completedTests = {}; // Безопасный fallback
}

// Функция сохранения статуса теста с улучшенной обработкой ошибок
function saveTestCompletion(testId, isCompleted) {
  // Валидация входных данных
  if (typeof testId !== 'number' || testId <= 0) {
    console.warn('Некорректный ID теста:', testId);
    return false;
  }
  
  if (typeof isCompleted !== 'boolean') {
    console.warn('Некорректное значение статуса:', isCompleted);
    return false;
  }
  
  completedTests[testId] = isCompleted;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTests));
    return true;
  } catch (error) {
    console.warn('Не удалось сохранить данные в localStorage:', error);
    return false;
  }
}

// Функция получения статуса теста с валидацией
function getTestCompletion(testId) {
  // Валидация входных данных
  if (typeof testId !== 'number' || testId <= 0) {
    console.warn('Некорректный ID теста:', testId);
    return false;
  }
  
  return completedTests[testId] || false;
}

// Экспортируем только функции — не экспортируем сам объект completedTests
export { saveTestCompletion, getTestCompletion };
