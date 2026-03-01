<script>
  import { saveTestCompletion } from '../../../completed.js';

  export let score;
  export let questions;
  export let percentage;
  export let resultMessage;
  export let texts;
  export let testId;
  export let onRetry;      // Колбэк для перезапуска теста
  export let onReturnToTests; // Колбэк для возврата к списку тестов

  // Сохраняем результат сразу после отображения результатов
  $: if (testId !== undefined) {
    saveTestCompletion(testId, percentage >= 80);
  }

  function handleReturn() {
    onReturnToTests?.(); // Вызываем колбэк возврата к списку тестов
  }

  function handleRetry() {
    onRetry?.(); // Вызываем колбэк перезапуска теста
  }
</script>

<div id="resultContainer" class="result" role="region" aria-label="Результаты теста">
  <h2>Результат теста</h2>
  <p>Вы ответили правильно на <span class="score">{score} из {questions.length}</span> вопросов.</p>
  <p>Результат: <strong>{percentage}%</strong></p>

  <p style="color: {percentage >= 80 ? '#28a745' : '#dc3545'}" aria-live="polite" role="status">
    {resultMessage}
  </p>

  <div class="navigation-links">
    {#if percentage < 80}
      <!-- Кнопка «Пересдать тест» -->
      <button
        class="btn-link retry"
        on:click={handleRetry}
        aria-label="Пересдать тест"
      >
        Пересдать тест
      </button>

      <!-- Кнопка «Перейти к тестам» -->
      <a href="/testing" class="btn-link" aria-label="Перейти к списку тестов">
        Перейти к тестам
      </a>

      <!-- Кнопка «Перейти к лекциям» -->
      <a href="/lectures" class="btn-link secondary" aria-label="Перейти к лекциям">
        Перейти к лекциям
      </a>
    {:else}
      <!-- При сданном тесте — только одна кнопка -->
      <button class="btn-link" on:click={handleReturn} aria-label="Вернуться к списку тестов">
        {texts.returnToTests}
      </button>
    {/if}
  </div>
</div>


<style>
  .btn-link {
    display: block;
    margin: 20px auto 0;
    padding: 12px 28px;
    background: #007BFF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
  }

  .btn-link:hover {
    background: #0056b3;
  }

  .retry {
    background: #dc3545; /* красный для пересдачи */
  }

  .retry:hover {
    background: #c82333;
  }

  .secondary {
    background: #6c757d; /* серый для дополнительных действий */
  }

  .secondary:hover {
    background: #545b62;
  }

  .result {
    text-align: center;
    padding: 30px;
    background: #f8f9fa;
    border-radius: 8px;
    max-width: 500px;
    margin: 40px auto;
  }

  .score {
    font-weight: bold;
    color: #007bff;
  }
</style>
