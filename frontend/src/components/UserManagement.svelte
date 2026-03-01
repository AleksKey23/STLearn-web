<script>
  import { usersStore, addUser, editUser, deleteUser } from '../stores.js';

  export let users = [];
  export let searchQuery = '';
  export let sortField = 'id';
  export let sortDirection = 'asc';
  export let onUserAdded;
  export let onUserEdited;
  export let onUserDeleted;

  let userName = '';
  let userRole = 'student';

  // Сортировка пользователей
  function sortUsers(users) {
    return users.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  }

  // Фильтрация пользователей
  function filterUsers(users) {
    if (!searchQuery) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Добавление пользователя с улучшенной валидацией
    function handleAddUser(event) {
      event.preventDefault();
  
      if (!userName || !userName.trim()) {
        alert('Введите имя пользователя');
        return;
      }
      
      // Проверка длины имени пользователя
      if (userName.trim().length < 2) {
        alert('Имя пользователя должно содержать не менее 2 символов');
        return;
      }
      
      // Проверка корректности роли
      if (userRole !== 'student' && userRole !== 'admin') {
        alert('Некорректная роль пользователя');
        return;
      }
  
      addUser({ name: userName.trim(), role: userRole });
      userName = '';
      userRole = 'student';
  
      if (onUserAdded) onUserAdded();
    }

  // Редактирование пользователя
  function handleEditUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('Введите новое имя:', user.name);
    if (newName) {
      editUser(userId, { name: newName });
      if (onUserEdited) onUserEdited();
    }
  }

  // Удаление пользователя
  function handleDeleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      deleteUser(userId);
      if (onUserDeleted) onUserDeleted();
    }
  }

  // Экспорт функций для использования в родительском компоненте
  function getFilteredAndSortedUsers() {
    return sortUsers(filterUsers(users));
  }

  $: exportedUsers = getFilteredAndSortedUsers();
</script>

<div class="user-management">
  <div class="form-container">
    <h3>Добавить пользователя</h3>
    <form on:submit|preventDefault={handleAddUser}>
      <div class="form-group">
        <label for="userName">Имя пользователя</label>
        <input type="text" id="userName" bind:value={userName} placeholder="Введите имя" />
      </div>
      <div class="form-group">
        <label for="userRole">Роль</label>
        <select id="userRole" bind:value={userRole}>
          <option value="student">Студент</option>
          <option value="admin">Администратор</option>
        </select>
      </div>
      <button type="submit">Добавить пользователя</button>
    </form>
  </div>

  <div class="form-container">
    <h3>Поиск и сортировка пользователей</h3>
    <div class="search-sort-container">
      <div class="search-box">
        <label for="searchQuery">Поиск по имени</label>
        <input 
          type="text" 
          id="searchQuery" 
          bind:value={searchQuery} 
          placeholder="Введите имя пользователя" 
          class="search-input"
        />
      </div>
      <div class="sort-box">
        <label for="sortField">Сортировать по</label>
        <select id="sortField" bind:value={sortField} class="sort-select">
          <option value="id">ID</option>
          <option value="name">Имя</option>
          <option value="role">Роль</option>
          <option value="progress">Прогресс</option>
        </select>
        <select bind:value={sortDirection} class="sort-select">
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>
    </div>
  </div>

  <div class="table-container">
    <h3>Список пользователей</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Роль</th>
          <th>Прогресс</th>
          <th>Дата регистрации</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody id="users-table">
        {#each exportedUsers as user}
          <tr>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.role === 'admin' ? 'Администратор' : 'Студент'}</td>
            <td>
              <div class="progress-bar" style="height: 15px; width: 100px; display: inline-block;">
                <div 
                  class="progress-fill" 
                  style="width: {user.progress}%; background: linear-gradient(90deg, #007BFF, #0056b3);"
                ></div>
              </div>
              {user.progress}%
            </td>
            <td>{user.registrationDate}</td>
            <td>
              <button on:click={() => handleEditUser(user.id)} class="btn-edit">✏️</button>
              <button on:click={() => handleDeleteUser(user.id)} class="btn-delete">🗑️</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .user-management {
    width: 100%;
  }
  
  .form-container {
    background: linear-gradient(135deg, #f5f7fa, #e4e7f4);
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 30px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 25px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #333;
    font-size: 16px;
  }
  
  input, select {
    width: 100%;
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    transition: all 0.3s;
    background: rgba(255, 255, 255, 0.8);
  }
  
  input:focus, select:focus {
    border-color: #007BFF;
    outline: none;
    box-shadow: 0 0 10px rgba(0,123,255,0.5);
    background: white;
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
  
  button[type="submit"] {
    background: linear-gradient(135deg, #007BFF, #0056b3);
    color: white;
    font-size: 16px;
    padding: 15px 30px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
  }
  
  button[type="submit"]:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.6);
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
  
  h3 {
    color: #007BFF;
    margin-bottom: 25px;
    font-size: 1.8em;
    font-weight: 700;
  }
  
  /* Поиск и сортировка */
  .search-sort-container {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }
  
  .search-box, .sort-box {
    flex: 1;
    min-width: 250px;
  }
  
  .search-input, .sort-select {
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    border: 2px solid #ddd;
    font-size: 16px;
  }
  
  /* Адаптивность */
  @media (max-width: 768px) {
    .search-sort-container {
      flex-direction: column;
    }
  }
</style>