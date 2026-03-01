<script>
  export let stats = {};
  export let lectures = [];
  export let tests = [];
</script>

<div class="analytics">
  <div class="chart-container">
    <div class="chart-title">Статистика завершения курсов</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{stats.completedLectures}/{lectures.length}</div>
        <div class="stat-label">Завершенные лекции</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{stats.completedTests}/{tests.length}</div>
        <div class="stat-label">Пройденные тесты</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{Math.round((stats.completedLectures + stats.completedTests) * 0.5)}ч</div>
        <div class="stat-label">Общее время обучения</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{stats.completionRate}%</div>
        <div class="stat-label">Общий прогресс</div>
      </div>
    </div>
  </div>

  <div class="table-container">
    <h3>Детальная аналитика</h3>
    <table>
      <thead>
        <tr>
          <th>Показатель</th>
          <th>Значение</th>
          <th>Иконка</th>
          <th>Динамика</th>
        </tr>
      </thead>
      <tbody id="analytics-table">
        <tr>
          <td>Завершение лекций</td>
          <td>{stats.completedLectures}/{lectures.length}</td>
          <td>📈</td>
          <td>+{stats.completedLectures * 20}%</td>
        </tr>
        <tr>
          <td>Успешность тестов</td>
          <td>{stats.completedTests}/{tests.length}</td>
          <td>📈</td>
          <td>+{stats.completedTests * 20}%</td>
        </tr>
        <tr>
          <td>Общее время обучения</td>
          <td>{Math.round((stats.completedLectures + stats.completedTests) * 0.5)}ч</td>
          <td>⏱️</td>
          <td>+{Math.round((stats.completedLectures + stats.completedTests) * 0.5)}ч</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style>
  .analytics {
    width: 100%;
  }
  
  .chart-container {
    background: white;
    border-radius: 15px;
    padding: 25px;
    margin: 25px 0;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }
  
  .chart-title {
    text-align: center;
    color: #007BFF;
    margin-bottom: 20px;
    font-size: 1.5em;
    font-weight: 600;
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
  }
</style>