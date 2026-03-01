<script>
  import page from 'page';
  import { onMount } from 'svelte';
  import { usersStore, activityStore, lecturesStore, testsStore, loadActivityFromLocalStorage, saveActivityToLocalStorage, loadLecturesFromLocalStorage, loadTestsFromLocalStorage } from '../stores.js';
  import Dashboard from '../components/Dashboard.svelte';
  import UserManagement from '../components/UserManagement.svelte';
  import LectureManagement from '../components/LectureManagement.svelte';
  import TestManagement from '../components/TestManagement.svelte';
  import Analytics from '../components/Analytics.svelte';

  let adminData = {
    users: [],
    activity: []
  };

  let lecturesData = [];
  let testsData = [];

  // Подписки на хранилища
  usersStore.subscribe(users => {
    adminData.users = users;
  });

  activityStore.subscribe(activities => {
    adminData.activity = activities;
  });

  lecturesStore.subscribe(lectures => {
    lecturesData = lectures;
  });

  testsStore.subscribe(tests => {
    testsData = tests;
  });

  const stats = {
    completedLectures: 0,
    completedTests: 0,
    completionRate: 0
  };

  let currentSection = 'dashboard';
  let searchQuery = '';
  let sortField = 'id';
  let sortDirection = 'asc';

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    page('/');
  }

  // Расчёт статистики
  function calculateStats() {
    const completedLectures = lecturesData.filter(l => l.completed).length;
    const completedTests = testsData.filter(t => t.completed).length;
    const total = lecturesData.length + testsData.length;

    stats.completionRate = total > 0
      ? Math.round((completedLectures + completedTests) / total * 100)
      : 0;
    stats.completedLectures = completedLectures;
    stats.completedTests = completedTests;
  }

  // Просмотр деталей лекций
  function viewLectureDetails(lectureId) {
    const lecture = lecturesData.find(l => l.id === lectureId);
    if (lecture) {
      alert(`Детали лекции: ${lecture.title}\nСтатус: ${lecture.completed ? 'Пройдена' : 'Не пройдена'}`);
    }
  }

  // Просмотр результатов тестов
  function viewTestResults(testId) {
    const test = testsData.find(t => t.id === testId);
    if (test) {
      alert(`Результаты теста: ${test.title}\nСтатус: ${test.completed ? 'Пройден' : 'Не пройден'}`);
    }
  }

  // Переключение секций
  function switchSection(section) {
    currentSection = section;
    calculateStats();
  }

  // Инициализация при загрузке
  onMount(() => {
    loadLecturesFromLocalStorage();
    loadTestsFromLocalStorage();
    loadActivityFromLocalStorage();
    calculateStats();
  });
</script>

<style>
  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
  }
  
  .logout-button {
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 75, 43, 0.4);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1000;
 }
  
  .logout-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 75, 43, 0.6);
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    padding: 30px;
    margin-top: 20px;
    backdrop-filter: blur(10px);
  }
  
  .header {
    background: linear-gradient(135deg, #007BFF, #0056b3);
    color: white;
    padding: 30px;
    margin-bottom: 30px;
    text-align: center;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
  }
  
  .nav-container {
    display: flex;
    flex-direction: row;
    gap: 15px;
    justify-content: space-between;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  
  .nav-item {
    flex: 1;
    padding: 18px;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: white;
    text-decoration: none;
    border-radius: 12px;
    cursor: pointer;
    text-align: center;
    border: none;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.4s ease;
    min-width: 160px;
    box-shadow: 0 5px 15px rgba(37, 117, 252, 0.4);
  }

  .nav-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(37, 117, 252, 0.6);
  }
  
  .section {
    display: none;
  }
  
  .section:not([hidden]) {
    display: block;
    animation: fadeIn 0.6s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Адаптивность */
  @media (max-width: 768px) {
    .nav-container {
      flex-direction: column;
    }
  }
  
  /* Анимации */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
</style>

<button class="logout-button" on:click={handleLogout}>Выйти</button>
<div class="container">
  <div class="header">
    <h1>📊 Админ-панель STLearn</h1>
    <p>Управление пользователями и образовательным контентом</p>
  </div>

  <!-- Навигация -->
  <div class="nav-container">
    <button class="nav-item" on:click={() => switchSection('dashboard')}>📈 Дашборд</button>
    <button class="nav-item" on:click={() => switchSection('users')}>👥 Пользователи</button>
    <button class="nav-item" on:click={() => switchSection('lectures')}>📚 Лекции</button>
    <button class="nav-item" on:click={() => switchSection('tests')}>🧪 Тесты</button>
    <button class="nav-item" on:click={() => switchSection('analytics')}>📊 Аналитика</button>
  </div>

  <!-- Дашборд -->
  <div id="dashboard" class="section" hidden={currentSection !== 'dashboard'}>
    <Dashboard 
      users={adminData.users} 
      lectures={lecturesData} 
      tests={testsData} 
      stats={stats} 
    />
  </div>

  <!-- Управление пользователями -->
  <div id="users" class="section" hidden={currentSection !== 'users'}>
    <UserManagement 
      users={adminData.users}
      searchQuery={searchQuery}
      sortField={sortField}
      sortDirection={sortDirection}
      onUserAdded={calculateStats}
      onUserEdited={calculateStats}
      onUserDeleted={calculateStats}
    />
  </div>

  <!-- Лекции -->
  <div id="lectures" class="section" hidden={currentSection !== 'lectures'}>
    <LectureManagement 
      lectures={lecturesData} 
      onViewDetails={viewLectureDetails} 
    />
  </div>

  <!-- Тесты -->
  <div id="tests" class="section" hidden={currentSection !== 'tests'}>
    <TestManagement 
      tests={testsData} 
      onViewResults={viewTestResults} 
    />
  </div>

  <!-- Аналитика -->
  <div id="analytics" class="section" hidden={currentSection !== 'analytics'}>
    <Analytics 
      stats={stats} 
      lectures={lecturesData} 
      tests={testsData} 
    />
  </div>
</div>