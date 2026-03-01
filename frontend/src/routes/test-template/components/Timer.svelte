<script>
  import { onMount, onDestroy } from 'svelte';

  export let totalTime = 600; // 10 минут в секундах
  export let className = ''; // Переименовали с class на className
  export let onTimeUp = () => {}; // Обработчик события завершения времени

  let remainingTime = totalTime;
  let timerInterval;

  onMount(() => {
    remainingTime = totalTime;

    timerInterval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
      } else {
        clearInterval(timerInterval);
        onTimeUp(); // Уведомляем родительский компонент
      }
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(timerInterval);
  });

  $: formattedTime = formatTime(remainingTime);
  $: isWarning = remainingTime <= 60; 
  $: timerClasses = [
    'timer',
    className,
    isWarning ? 'timer-warning' : ''
  ].filter(Boolean).join(' '); 

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<div class="timer-container" role="timer" aria-live="polite">
  <div class={timerClasses} aria-label="Оставшееся время: {formattedTime}">
    <p class="timer-label">Осталось времени: {formattedTime}</p>
  </div>
</div>

<style>
  .timer-container {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap; }

  .timer-label {
    font-size: 1.2rem;
    color: #161414;
    font-weight: 500;
    white-space: nowrap;
    display: flex;
    align-items: center;  
    justify-content: center; }

  .timer {
    font-size: 1.5rem;
    font-weight: bold;
    color: #131111;
    padding: 8px 16px;
    background: linear-gradient(135deg, #e9ebee, #609efa);
    border-radius: 8px;
    transition: color 0.3s, background-color 0.3s;
    width: 100%; }

  .timer-warning {
    color: #d41528;
    background-color: #f3081c;
    animation: pulse 1s infinite;
    border: 2px solid #d41528; }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
</style>

