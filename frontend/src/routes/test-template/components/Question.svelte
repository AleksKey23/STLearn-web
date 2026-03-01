<script>
  export let currentQuestionIndex;
  export let questions;
  export let userAnswers;
  export let handleOptionClick;

  // Получаем текущий вопрос
  $: currentQuestion = 
  currentQuestionIndex >= 0 && 
  currentQuestionIndex < questions.length 
    ? questions[currentQuestionIndex] 
    : null;
</script>

<div class="question-container" id="questionContainer" role="region" aria-label="Вопрос теста">
  {#if currentQuestion}
    <div class="question">
      <h3
        id="question-label-{currentQuestionIndex}"
        aria-labelledby="question-label-{currentQuestionIndex}"
      >
        {currentQuestion.question}
      </h3>

      <div
        class="options"
        role="radiogroup"
        aria-labelledby="question-label-{currentQuestionIndex}"
        aria-label="Варианты ответов"
      >
        {#each currentQuestion.options as option, idx}
          <button
            type="button"
            class="option {userAnswers[currentQuestionIndex] === idx ? 'selected' : ''}"
            on:click={() => handleOptionClick(idx)}
            aria-checked={userAnswers[currentQuestionIndex] === idx}
            role="radio"
            aria-label="Вариант ответа: {option}"
          >
            {option}
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <p role="alert">Вопрос не найден</p>
  {/if}
</div>

<style>
  .question-container {
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  .question h3 {
    margin-top: 0;
    color: #333;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .option {
    padding: 14px 16px;
    text-align: left;
    border: 2px solid #ddd;
    border-radius: 6px;
    background: white;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px
  }

  .option:hover {
    border-color: #007bff;
    background-color: #b9d2eb;
  }

  .option.selected {
    border-color: #007bff;
    background-color: #b9d2eb;
  }

</style>