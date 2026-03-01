<script>
  import { activityStore } from '../stores.js';

  export let users = [];
  export let lectures = [];
  export let tests = [];
  export let stats = {};

  let activity = [];

  // Подписка на хранилище активности
  activityStore.subscribe(activities => {
    activity = activities;
  });

  // Получение активных пользователей сегодня
  function getTodayActiveUsers() {
    const today = new Date().toLocaleDateString('ru-RU');
    return activity.filter(act => act.date === today);
  }
</script>

<div class="dashboard">
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-number">{users.length}</div>
      <div class="stat-label">Всего пользователей</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{stats.completionRate}%</div>
      <div class="stat-label">Средний прогресс</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{stats.completedTests}</div>
      <div class="stat-label">Пройдено тестов</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">{getTodayActiveUsers().length}</div>
      <div class="stat-label">Активных сегодня</div>
    </div>
  </div>

  <div class="progress-section">
    <h3>Прогресс обучения</h3>
    <div class="progress-bar">
      <div
        class="progress-fill"
        style="width: {stats.completionRate}%"
      ></div>
    </div>
    <div>Общий прогресс: <span>{stats.completionRate}</span>% (<span>{stats.completedLectures + stats.completedTests}</span>/<span>{lectures.length + tests.length}</span> лекций и тестов)</div>
  </div>

  <div class="table-container">
    <h3>Последняя активность</h3>
    <table>
      <thead>
        <tr>
          <th>Пользователь</th>
          <th>Действие</th>
          <th>Время</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody id="activity-table">
        {#if activity.length === 0}
          <tr>
            <td colspan="4" style="text-align: center;">Активность не найдена</td>
          </tr>
        {:else}
          {#each activity.slice(-5).reverse() as activityItem}
            <tr>
              <td>{activityItem.user || 'Пользователь'}</td>
              <td>{activityItem.action}</td>
              <td>{activityItem.timestamp}</td>
              <td>
                <span class="status-badge {activityItem.success ? 'status-completed' : 'status-pending'}">
                  {activityItem.success ? 'Успешно' : 'В процессе'}
                </span>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

<style>
  .dashboard {
    width: 100%;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #007BFF, #00d2ff);
    color: white;
    padding: 25px;
    text-align: center;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .stat-card:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(30deg);
    transition: all 0.8s;
  }
  
  .stat-card:hover:before {
    transform: rotate(30deg) translate(20%, 20%);
  }
  
  .stat-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 123, 255, 0.5);
  }
  
  .stat-number {
    font-size: 3em;
    font-weight: 800;
    margin: 10px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .progress-section {
    margin: 40px 0;
    padding: 30px;
    background: linear-gradient(135deg, #f5f7fa, #e4e7f4);
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
  
  .progress-bar {
    height: 30px;
    background-color: #e0e0e0;
    border-radius: 15px;
    overflow: hidden;
    margin: 20px 0;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    transition: width 1s ease;
    border-radius: 15px;
    position: relative;
  }
  
  .progress-fill:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%
    );
    background-size: 30px 30px;
    animation: move 1s linear infinite;
    overflow: hidden;
  }
  
  @keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 30px 30px;
    }
  }
  
  .table-container {
    overflow-x: auto;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.1);
    border-radius: 12px;
    overflow: hidden;
  }
  
  th, td {
    padding: 18px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background: linear-gradient(135deg, #007BFF, #0056b3);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  tr:nth-child(even) {
    background-color: #f8f9ff;
  }
  
  tr:hover {
    background: linear-gradient(90deg, rgba(0,123,255,0.1), transparent);
    transform: scale(1.01);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .status-badge {
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 600;
    display: inline-block;
  }
  
  .status-completed {
    background: linear-gradient(135deg, #00b09b, #96c93d);
    color: white;
    box-shadow: 0 3px 10px rgba(0, 176, 155, 0.3);
  }
  
  .status-pending {
    background: linear-gradient(135deg, #ffd89b, #19547b);
    color: white;
    box-shadow: 0 3px 10px rgba(25, 84, 123, 0.3);
  }
  
  h3 {
    color: #007BFF;
    margin-bottom: 25px;
    font-size: 1.8em;
    font-weight: 700;
  }
  
  /* Адаптивность */
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .stat-card {
      margin-bottom: 20px;
    }
    
    table {
      font-size: 14px;
    }
    
    th, td {
      padding: 12px;
    }
  }
</style>