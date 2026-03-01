<script>
  import { onMount } from 'svelte';
  import page from 'page';
  import { getTestCompletion } from '../completed.js';
  

  let showModal = false;
  let currentTest = null;
  let modalCloseButton;

  const tests = [
    {
      id: 1,
      title: "Средства индивидуальной защиты",
      description: "Тест на знание видов СИЗ, правил их применения, сроков службы и норм выдачи. Включает вопросы о респираторах, перчатках, костюмах и очках."
    },
    {
      id: 2,
      title: "Безопасная эксплуатация складского оборудования",
      description: "Проверка знаний по работе с погрузчиками, штабелёрами, тележками и конвейерами. Вопросы по технике безопасности, инструктажу и действиям при неисправности."
    },
    {
      id: 3,
      title: "Пожарная безопасность на складе",
      description: "Тест на знание классов пожаров, типов огнетушителей, правил хранения горючих материалов, эвакуации и действий при возгорании."
    },
    {
      id: 4,
      title: "Основы оказания первой медицинской помощи",
      description: "Проверка знаний алгоритмов первой помощи при травмах, кровотечениях, ожогах, обмороках и остановке дыхания. Вопросы по использованию аптечки и вызову скорой."
    },
    {
      id: 5,
      title: "Погрузочно‑разгрузочные работы и работа на высоте",
      description: "Тест на знание безопасных методов погрузки/разгрузки, использования подъёмников, лестниц и настилов. Вопросы по страховке, ограждениям и допуску на высоту."
    }
  ];

  // Массив для хранения статусов тестов
  let testStatuses = {};

  onMount(async () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Загружаем статусы всех тестов при монтировании компонента с обработкой ошибок
    for (const test of tests) {
      try {
        testStatuses[test.id] = getTestCompletion(test.id);
      } catch (error) {
        console.error(`Ошибка загрузки статуса для теста ${test.id}:`, error);
        testStatuses[test.id] = false; // Устанавливаем статус «Не пройден» при ошибке
      }
    }
  });

  // Функция для получения статуса теста
  function getStatus(testId) {
    return testStatuses[testId] ? '✅ Пройдено' : '❌ Не пройдено';
  }

  // Открывает модальное окно с информацией о тесте
  function openTestModal(test) {
    currentTest = test;
    showModal = true;
    // Убираем лишний tick()
    if (modalCloseButton) modalCloseButton.focus();
  }

  // Закрывает модальное окно
  function closeModal() {
    showModal = false;
    currentTest = null;
  }

  function goToMainbar() {
    page('/');
  }

  // Запуск теста — переход на страницу тестирования
  function startTest(testId, testTitle) {
    const encodedTitle = encodeURIComponent(testTitle);
    page(`/test-template?id=${testId}&title=${encodedTitle}`);
  }
</script>

<button class="logout-btn" on:click={goToMainbar}>В меню</button>

<div class="container">
  <h1>Тестирование</h1>

  <ul class="test-list">
    {#each tests as test}
      <li class="test-item {testStatuses[test.id] ? 'completed' : ''}">
        <div
          class="test-card"
          role="button"
          tabindex="0"
          aria-label="Открыть тест: {test.title}"
          on:click={() => openTestModal(test)}
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openTestModal(test);
            }
          }}
        >
          <div class="test-info">
            <h3>{test.title}</h3>
            <p>{test.description}</p>
            <!-- Отображение статуса прохождения теста -->
            <span class="status {testStatuses[test.id] ? 'completed' : ''}">
              {getStatus(test.id)}
            </span>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>

<!-- Модальное окно с информацией о тесте -->
{#if showModal && currentTest}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    aria-hidden="false" 
    on:click={closeModal}
    on:keydown={(e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
      // Обработка Tab для ограничения фокуса внутри модального окна
      if (e.key === 'Tab') {
        e.preventDefault();
        modalCloseButton.focus();
      }
    }}
  >
    <div class="modal-content">
      <h2 id="modal-title">{currentTest.title}</h2>
      <p>{currentTest.description}</p>

      <div class="modal-actions">
        <button
          class="modal-btn"
          on:click={closeModal}
          bind:this={modalCloseButton}
        >
          Закрыть
        </button>

        <button
          class="modal-btn start-test"
          on:click={() => startTest(currentTest.id, currentTest.title)}
        >
          Начать тестирование
        </button>
      </div>
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

  :global(body) {
    background: linear-gradient(135deg, #e6f7ff, #ffffff);
    min-height: 100vh;
    padding: 20px;
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

  .test-list {
    list-style: none;
  }

  .test-item {
      padding: 20px;
      margin-bottom: 20px;
      background: #f8f9ff;
      border-radius: 12px;
      border-left: 4px solid #8687c9;
      position: relative;
      transition: all 0.3s ease;
  }

  .test-item.completed {
    background: #e8f4f0;
    border-left-color: #28a745;
  }

  .test-item:hover {
    background: #eef4ff;
    transform: translateX(4px);
    border-left: 10px solid #3646c4;
  }

  .test-info h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
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

    .test-item {
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

  .test-card {
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

.test-card:hover {
  background: #e9ecf5;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.test-card:focus {
  border-color: #007BFF;
  outline: 2px solid #007BFF;
  outline-offset: 2px;
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
