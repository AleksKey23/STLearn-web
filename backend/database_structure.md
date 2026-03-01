# Структура базы данных для онлайн-платформы обучения

## Общее описание
База данных предназначена для хранения информации о пользователях, лекциях, тестах и прогрессе пользователей по лекциям и тестам.

## Таблицы

### 1. Пользователи (users)
Хранит информацию о зарегистрированных пользователях системы.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Поля:
- `id` - уникальный идентификатор пользователя
- `username` - имя пользователя (уникальное)
- `email` - email пользователя (уникальный)
- `password_hash` - хэш пароля пользователя
- `role` - роль пользователя (user/admin)
- `created_at` - дата и время создания записи
- `updated_at` - дата и время последнего обновления записи

### 2. Лекции (lectures)
Хранит информацию о доступных лекциях.

```sql
CREATE TABLE lectures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  duration INT, -- продолжительность в минутах
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Поля:
- `id` - уникальный идентификатор лекции
- `title` - название лекции
- `description` - описание лекции
- `video_url` - URL видео лекции
- `duration` - продолжительность лекции в минутах
- `created_at` - дата и время создания записи
- `updated_at` - дата и время последнего обновления записи

### 3. Прогресс по лекциям (lecture_progress)
Отслеживает прогресс пользователей по лекциям.

```sql
CREATE TABLE lecture_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lecture_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_lecture (user_id, lecture_id)
);
```

Поля:
- `id` - уникальный идентификатор записи
- `user_id` - идентификатор пользователя
- `lecture_id` - идентификатор лекции
- `completed` - статус завершения лекции
- `viewed_at` - дата и время последнего просмотра
- `updated_at` - дата и время последнего обновления записи

### 4. Тесты (tests)
Хранит информацию о доступных тестах.

```sql
CREATE TABLE tests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  pass_threshold INT DEFAULT 80, -- порог прохождения в процентах
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Поля:
- `id` - уникальный идентификатор теста
- `title` - название теста
- `description` - описание теста
- `pass_threshold` - минимальный процент для прохождения теста
- `created_at` - дата и время создания записи
- `updated_at` - дата и время последнего обновления записи

### 5. Вопросы тестов (test_questions)
Хранит вопросы для тестов.

```sql
CREATE TABLE test_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  test_id INT NOT NULL,
  question_text TEXT NOT NULL,
  correct_answer_index INT NOT NULL, -- индекс правильного ответа (0-based)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);
```

Поля:
- `id` - уникальный идентификатор вопроса
- `test_id` - идентификатор теста
- `question_text` - текст вопроса
- `correct_answer_index` - индекс правильного ответа (0-based)
- `created_at` - дата и время создания записи
- `updated_at` - дата и время последнего обновления записи

### 6. Варианты ответов (question_options)
Хранит варианты ответов для вопросов тестов.

```sql
CREATE TABLE question_options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  option_index INT NOT NULL, -- порядковый номер варианта ответа
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES test_questions(id) ON DELETE CASCADE
);
```

Поля:
- `id` - уникальный идентификатор варианта ответа
- `question_id` - идентификатор вопроса
- `option_text` - текст варианта ответа
- `option_index` - порядковый номер варианта ответа
- `created_at` - дата и время создания записи
- `updated_at` - дата и время последнего обновления записи

### 7. Результаты тестов (test_results)
Хранит результаты прохождения тестов пользователями.

```sql
CREATE TABLE test_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  test_id INT NOT NULL,
  score INT NOT NULL, -- количество правильных ответов
  total_questions INT NOT NULL, -- общее количество вопросов
  percentage DECIMAL(5,2) NOT NULL, -- процент правильных ответов
  passed BOOLEAN NOT NULL, -- результат прохождения (успешно/неуспешно)
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_test (user_id, test_id)
);
```

Поля:
- `id` - уникальный идентификатор результата
- `user_id` - идентификатор пользователя
- `test_id` - идентификатор теста
- `score` - количество правильных ответов
- `total_questions` - общее количество вопросов
- `percentage` - процент правильных ответов
- `passed` - результат прохождения (успешно/неуспешно)
- `completed_at` - дата и время завершения теста

### 8. Ответы пользователей (user_answers)
Хранит ответы пользователей на вопросы тестов.

```sql
CREATE TABLE user_answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  test_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option_id INT, -- идентификатор выбранного варианта ответа (может быть NULL)
  is_correct BOOLEAN, -- правильность ответа
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES test_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE SET NULL
);
```

Поля:
- `id` - уникальный идентификатор ответа
- `user_id` - идентификатор пользователя
- `test_id` - идентификатор теста
- `question_id` - идентификатор вопроса
- `selected_option_id` - идентификатор выбранного варианта ответа
- `is_correct` - правильность ответа
- `answered_at` - дата и время ответа

## Заключение

Эта структура базы данных обеспечивает хранение всей необходимой информации для функционирования онлайн-платформы обучения, включая:
- Управление пользователями
- Хранение лекций и отслеживание прогресса
- Проведение тестов с возможностью детального анализа результатов
- Гибкую систему управления контентом

Структура спроектирована с учетом требований нормализации и оптимизации производительности.