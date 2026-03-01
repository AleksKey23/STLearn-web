<script>
  export let lectures = [];
  export let onViewDetails;

  // Просмотр деталей лекции
  function handleViewDetails(lectureId) {
    if (onViewDetails) {
      onViewDetails(lectureId);
    }
  }
</script>

<div class="lecture-management">
  <div class="table-container">
    <h3>Список лекций</h3>
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Описание</th>
          <th>Статус</th>
          <th>Прогресс</th>
          <th>Длительность</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody id="lectures-table">
        {#each lectures as lecture}
          <tr>
            <td>{lecture.title}</td>
            <td>{lecture.description}</td>
            <td>
              <span class="status-badge {lecture.completed ? 'status-completed' : 'status-pending'}">
                {lecture.completed ? 'Пройдена' : 'Не пройдена'}
              </span>
            </td>
            <td>{lecture.completed ? '100%' : '0%'}</td>
            <td>25 мин</td>
            <td><button on:click={() => handleViewDetails(lecture.id)}>👁️</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .lecture-management {
    width: 100%;
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
  
  button {
    padding: 14px 25px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin: 0 5px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
  
  .btn-edit {
    background: linear-gradient(135deg, #ffb347, #ffcc33);
    color: #333;
  }
  
  .btn-edit:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(255, 204, 51, 0.4);
  }
  
  .btn-delete {
    background: linear-gradient(135deg, #ff416c, #ff4b2b);
    color: white;
  }
  
  .btn-delete:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(255, 75, 43, 0.4);
  }
  
  h3 {
    color: #007BFF;
    margin-bottom: 25px;
    font-size: 1.8em;
    font-weight: 700;
  }
</style>