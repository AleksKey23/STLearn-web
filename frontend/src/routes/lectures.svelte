
<script>

  import { onMount, tick } from 'svelte';
  import page from 'page';
  import { lecturesStore, loadLecturesFromLocalStorage, updateLectureStatusLocal } from '../stores.js';

  let showModal = false;
  let currentLecture = null;
  let modalCloseButton;
  let lectures = [ ];

  $: lectures = $lecturesStore;

  onMount(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  if (typeof window === 'undefined') return;
  loadLecturesFromLocalStorage();
});

  // Открытие модального окна
  async function openLectureModal(lecture) {
    currentLecture = lecture;
    showModal = true;
    await tick();
    if (modalCloseButton) modalCloseButton.focus();
  }

  // Закрытие модального окна
  function closeModal() {
    showModal = false;
    currentLecture = null;
  }

  // Переключение статуса лекции
  function toggleLectureStatus(lecture) {
    lecture.completed = !lecture.completed;
    localStorage.setItem(`lecture_${lecture.id}`, lecture.completed);
  }

  function goToMainbar() {
    page('/mainbar');
  }

</script>

<button class="logout-btn" on:click={goToMainbar}>В меню</button>

<div class="container">
  <h1>Лекции</h1>

  <ul class="lecture-list">
  {#each lectures as lecture}
    <li class="lecture-item" class:completed={lecture.completed}>
      <div
        class="lecture-card"
        class:completed={lecture.completed}
        role="button"
        tabindex="0"
        aria-label="Открыть лекцию: {lecture.title}"
        on:click={() => openLectureModal(lecture)}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLectureModal(lecture);
          }
        }}
      >
        <div class="lecture-info">
          <h3>{lecture.title}</h3>
        </div>
        <span class="status" class:completed={lecture.completed}>
          {lecture.completed ? '✅ Пройдена' : '❌ Не пройдена'}
        </span>
      </div>
    </li>
  {/each}
</ul>
</div>



<!-- Модальное окно -->
{#if showModal && currentLecture}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    on:click={closeModal}
    on:keydown={(e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    }}
  >
    <div class="modal-content">
      <h2 id="modal-title">{currentLecture.title}</h2>
      <p>{currentLecture.description}</p>
      <button
        class="modal-btn"
        on:click={closeModal}
        bind:this={modalCloseButton}
      >
        Закрыть
      </button>
       <button
        class="modal-btn"
        on:click={() => {
        switch (currentLecture.id) {
         case 1:
         page('/lec-siz');
         break;
         case 2:
         page('/lec-beso');
         break;
         case 3:
         page('/lec-fireproof');
         break;
         case 4:
         page('/lec-emergency');
         break;
         case 5:
         page('/lec-prrirnv');
         break;
         default:
         console.warn('Неизвестная лекция с ID:', currentLecture.id);
         }
       }}
>
  Перейти к лекции
</button>

    </div>
  </div>
{/if}

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

   .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-overlay:focus-within {
  outline: 2px solid #007BFF;
  outline-offset: -2px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.modal-btn {
  display: block;
  margin: 20px auto 0;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4088d4, #96bfe2 );
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.modal-btn:hover {
  background: linear-gradient(135deg, #0066cc, #004499);
}

  .container {
    max-width: 800px;
    margin: 40px auto;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    animation: fadeIn 1s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  h1 {
    color: #007BFF;
    text-align: center;
    margin-bottom: 40px;
    font-size: 28px;
    font-weight: 700;
  }

  .lecture-list {
    list-style: none;
  }

  .lecture-item {
      padding: 20px;
      margin-bottom: 20px;
      background: #f8f9ff;
      border-radius: 12px;
      border-left: 4px solid #8687c9;
      position: relative;
      transition: all 0.3s ease;
  }

  .lecture-item.completed {
    background: #e8f4f0;
    border-left-color: #28a745;
  }

  .lecture-item:hover {
    background: #eef4ff;
    transform: translateX(4px);
    border-left: 10px solid #3646c4;
  }

  .lecture-info h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
  }

  .status {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
  }

  .status.completed {
    background: #d4edda;
    color: #155724;
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    padding: 30px;
    max-width: 700px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }


  .modal-btn {
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
    transition: background 0.3s;
  }

  .modal-btn:hover {
    background: #0056b3;
  }

  /* Адаптация для мобильных устройств */
  @media (max-width: 600px) {
    .container {
      margin: 20px;
      padding: 20px;
    }

    .lecture-item {
      padding: 15px;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 30px;
    }

    .modal-content {
      padding: 20px;
    }
  }

  .lecture-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 12px;
  border: 4px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.lecture-card:hover {
  background: #e9ecf5;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.lecture-card:focus {
  border-color: #007BFF;
  outline: 2px solid #007BFF;
  outline-offset: 2px;
}


.lecture-info h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
}

.status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status.completed {
  background: #d4edda;
  color: #155724;
}

.logout-btn {
    position: absolute;
    top: 24px;
    right: 32px;
    z-index: 11;
    margin-bottom: 16px;
    padding: 8px 16px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #dc3545, #a71d2a);
    color: #fff;
    font-weight: 600;
    animation: fadeIn 1s ease-out;
  }

  .logout-btn:hover {
      background: linear-gradient(45deg, #a71d2a, #007BFF);
      transform: translateX(4px);
    }
    
</style>
