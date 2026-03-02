<script>
  import { onMount } from 'svelte';
  import page from 'page';
  import { lecturesStore, loadLecturesFromLocalStorage } from '../stores.js';
  import { getTestCompletion } from '../completed.js';
  import config from '../config.js';

  let isEditing = false;
  let surname = '';
  let name = '';
  let patronymic = '';
  let position = '';
  let isLoading = false;
  let error = null;

  // Переменные для ссылок на элементы
  let editBtnElement;
  let saveBtnElement;

  // Данные о лекциях и тестах
  let lectures = [];
  let tests = [];
  let lastTest = null;
  let lastLecture = null;

  // Загрузка данных о лекциях из хранилища
  function loadLectures() {
    const storedLectures = JSON.parse(JSON.stringify($lecturesStore));
    // Добавляем дату последнего изменения и прогресс
    return storedLectures.map(lecture => {
      const isCompleted = lecture.completed;
      return {
        ...lecture,
        date: new Date().toISOString().split('T')[0], // Текущая дата для примера
        progress: isCompleted ? 100 : 0,
        status: isCompleted ? 'completed' : 'not_started'
      };
    });
  }

  // Загрузка данных о тестах
  function loadTests() {
    const testList = [
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

    // Добавляем статусы и даты
    return testList.map(test => {
      const isCompleted = getTestCompletion(test.id);
      return {
        ...test,
        date: new Date().toISOString().split('T')[0], // Текущая дата для примера
        progress: isCompleted ? 100 : 0,
        status: isCompleted ? 'completed' : 'not_started',
        score: isCompleted ? 18 : 0,
        maxScore: 20
      };
    });
  }

  // Получаем последний начатый тест
  function getLastTest() {
    const startedTests = tests.filter(test => test.status !== 'not_started');

    if (startedTests.length === 0) return null;

    return startedTests.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }

  // Получаем последнюю начатую лекцию
  function getLastLecture() {
    const startedLectures = lectures.filter(lecture => lecture.status !== 'not_started');

    if (startedLectures.length === 0) return null;

    return startedLectures.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }

  onMount(() => {
    // Загружаем данные о лекциях и тестах
    loadLecturesFromLocalStorage();
    lectures = loadLectures();
    tests = loadTests();
    
    // Обновляем последние активности
    lastTest = getLastTest();
    lastLecture = getLastLecture();

    // Обработчик нажатия Enter — объявляем внутри onMount
    const handleKeydown = (e) => {
      if (isEditing && e.key === 'Enter') {
        saveChanges();
      }
    };

    // Добавляем обработчик глобального события ТОЛЬКО НА КЛИЕНТЕ
    document.addEventListener('keydown', handleKeydown);

    // Возвращаем функцию очистки — лучший способ управления обработчиками
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  onMount(() => {
    // Обработчик нажатия Enter — объявляем внутри onMount
    const handleKeydown = (e) => {
      if (isEditing && e.key === 'Enter') {
        saveChanges();
      }
    };

    // Добавляем обработчик глобального события ТОЛЬКО НА КЛИЕНТЕ
    document.addEventListener('keydown', handleKeydown);

    // Возвращаем функцию очистки — лучший способ управления обработчиками
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  function toggleEdit() {
    isEditing = !isEditing;
  }

  async function saveChanges() {
  try {
    isLoading = true;
    error = null;

    const userData = {
      surname,
      name,
      patronymic,
      position
    };

    const response = await fetch(`${config.API_BASE_URL}/api/user/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Ошибка сети или сервера');
    }

    const result = await response.json();

    alert('Данные профиля успешно сохранены!');
    isEditing = false;
  } catch (err) {
    console.error('Ошибка сохранения:', err);
    error = 'Произошла ошибка при сохранении данных. Проверьте подключение к сети.';
    alert(error);
  } finally {
    isLoading = false;
  }
}

  function goToMainbar() {
    page('/');
  }

  async function loadUserData() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/user/profile`);

    if (response.ok) {
      const userData = await response.json();
      // Обновляем только заполненные поля
      if (userData.surname) surname = userData.surname;
      if (userData.name) name = userData.name;
      if (userData.patronymic) patronymic = userData.patronymic;
      if (userData.position) position = userData.position;
    }
  } catch (err) {
    console.warn('Не удалось загрузить данные профиля:', err);
    // Оставляем поля пустыми, если загрузка не удалась
  }
}

onMount(() => {
  loadUserData().catch(err => {
    console.warn('Не удалось загрузить данные профиля:', err);
  });

  const handleKeydown = (e) => {
    if (isEditing && e.key === 'Enter') {
      saveChanges();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  return () => {
    document.removeEventListener('keydown', handleKeydown);
  };
});

</script>

<button class="logout-btn" on:click={goToMainbar}>В меню</button>

<div class="container">
  <div class="header">
    <h1>Личный кабинет</h1>
  </div>

  <div class="profile-field">
    <label for="surname-edit">Фамилия</label>
    {#if isEditing}
      <input
        type="text"
        bind:value={surname}
        id="surname-edit"
      >
    {:else}
      <span>{surname}</span>
    {/if}
  </div>

  <div class="profile-field">
    <label for="name-edit">Имя</label>
    {#if isEditing}
      <input
        type="text"
        bind:value={name}
        id="name-edit"
      >
    {:else}
      <span>{name}</span>
    {/if}
  </div>

  <div class="profile-field">
    <label for="patronymic-edit">Отчество</label>
    {#if isEditing}
      <input
        type="text"
        bind:value={patronymic}
        id="patronymic-edit"
      >
    {:else}
      <span>{patronymic}</span>
    {/if}
  </div>

  <div class="profile-field">
    <label for="position-edit">Должность</label>
    {#if isEditing}
      <input
        type="text"
        bind:value={position}
        id="position-edit"
      >
    {:else}
      <span>{position}</span>
    {/if}
  </div>

  <div class="actions">
  <button
    class="btn btn-secondary"
    bind:this={editBtnElement}
    on:click={toggleEdit}
    disabled={isLoading}
  >
    {isEditing ? 'Отменить' : 'Редактировать'}
  </button>

  {#if isEditing}
    <button
      class="btn btn-primary"
      bind:this={saveBtnElement}
      on:click={saveChanges}
      disabled={isLoading}
    >
      {isLoading ? 'Сохранение...' : 'Сохранить'}
    </button>
  {/if}
</div>

{#if error}
  <div class="error-message">
    {error}
  </div>
{/if}

  <div class="divider"></div>

  <div class="recent-activity">
    <h2>Последние активности</h2>

    {#if lastTest}
      <div class="activity-item test">
        <div class="activity-info">
          <h3>{lastTest.title}</h3>
          <p>Дата: {lastTest.date}</p>
          {#if lastTest.status === 'completed'}
            <p class="score">Результат: {lastTest.score}/{lastTest.maxScore}</p>
          {:else}
            <p class="progress">Прогресс: {lastTest.progress}%</p>
          {/if}
        </div>
        <div class="activity-status {lastTest.status}">
          {#if lastTest.status === 'completed'}
            ✅ Завершён
          {:else if lastTest.status === 'started'}
            ⏱️ В процессе
          {/if}
        </div>
      </div>
    {:else}
      <p class="no-activity">Тесты ещё не начаты</p>
    {/if}

    {#if lastLecture}
      <div class="activity-item lecture">
        <div class="activity-info">
          <h3>{lastLecture.title}</h3>
          <p>Дата: {lastLecture.date}</p>
          <p class="progress">Прогресс: {lastLecture.progress}%</p>
        </div>
        <div class="activity-status {lastLecture.status}">
          {#if lastLecture.status === 'completed'}
            ✅ Завершена
          {:else if lastLecture.status === 'started'}
            ⏱️ В процессе
          {/if}
        </div>
      </div>
    {:else}
      <p class="no-activity">Лекции ещё не начаты</p>
    {/if}
  </div>
</div>

<style>
  .recent-activity {
  margin-top: 40px;
}

.recent-activity h2 {
  color: #007BFF;
  margin-bottom: 20px;
  font-size: 22px;
  text-align: center;
  border-bottom: 2px solid #e0e0ff;
  padding-bottom: 8px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 3px solid #ccc;
  transition: transform 0.2s, box-shadow 0.2s;
}

.activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.activity-item.test {
  border-left-color: #28a745;
}

.activity-item.lecture {
  border-left-color: #007BFF;
}

.activity-info h3 {
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
  font-weight: 600;
}

.activity-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.score {
  color: #28a745;
  font-weight: 600;
}

.progress {
  color: #007BFF;
  font-weight: 600;
}

.activity-status {
  text-align: right;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.activity-status.completed {
  color: #28a745;
}

.activity-status.started {
  color: #ffc107;
}

.no-activity {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
  font-size: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #6c757d;
}


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

.profile-field {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 10px;
  border-left: 4px solid #007BFF;
}

.profile-field label {
  font-weight: 600;
  color: #333;
  flex: 1;
}

.profile-field span,
.profile-field input {
  color: #555;
  font-size: 16px;
  flex: 2;
  text-align: right;
  border: none;
  background: transparent;
  outline: none;
}

.profile-field input {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 4px;
  transition: border-color 0.3s;
}

.profile-field input:focus {
  border-bottom-color: #007BFF;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 30px 0;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 40px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #007BFF, #0056b3);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3);
  background: linear-gradient(90deg, #0e2b7a, #06205a);
}

.btn-secondary {
  background: linear-gradient(135deg, #007BFF, #0056b3);
  color: white;
}

.btn-secondary:hover {
  background: #8f161e;
  transform: translateY(-2px);
}

/* Мобильная адаптация */
@media (max-width: 600px) {
  .profile-field {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .profile-field span,
  .profile-field input {
    text-align: left;
    width: 100%;
  }

  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .activity-status {
    justify-content: flex-end;
    width: 100%;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 200px;
  }
}

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .menu-button {
    padding: 8px 16px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .menu-button:hover {
    background-color: #0056b3;
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

    .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    color: #dc3545;
    background: #f8d7da;
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
  }

</style>
