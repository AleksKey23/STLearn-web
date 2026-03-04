<script>
  import page from 'page';
  import config from '../config.js';

  let username = '';
  let password = '';
  let role = 'student'; // Убрали isAdmin, теперь используем role
  let error = '';

  // Переопределили вычисляемые свойства через role
  $: adminBtnClasses = role === 'admin' ? 'admin-btn active' : 'admin-btn';
  $: adminHintDisplay = role === 'admin' ? 'block' : 'none';

  async function handleSubmit(event) {
    event.preventDefault();
    error = '';

    // Расширенная валидация данных формы (без изменений)
    if (!username || !username.trim()) {
      error = 'Пожалуйста, введите логин';
      return;
    }
    
    if (!password || !password.trim()) {
      error = 'Пожалуйста, введите пароль';
      return;
    }
    
    if (username.trim().length < 3) {
      error = 'Логин должен содержать не менее 3 символов';
      return;
    }
    
    if (password.length < 4) {
      error = 'Пароль должен содержать не менее 4 символов';
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await response.json();

      if (response.ok) {
        // Успешная аутентификация
        // Определяем роль на основе данных сервера
        role = data.role || 'student'; // Если роль не указана — по умолчанию 'student'

        const user = { username: username.trim(), role };

        // Сохраняем информацию в localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('currentUser', username.trim());
        localStorage.setItem('userRole', role);
        localStorage.setItem('isAuthenticated', 'true');

        // Перенаправление зависит от роли
        if (role === 'admin') {
          page.show('/admin');
        } else {
          page.show('/mainbar');
        }
      } else {
        error = data.error || 'Неверный логин или пароль';
      }
    } catch (e) {
      console.error('Ошибка при попытке входа:', e);
      error = 'Произошла ошибка при попытке входа. Попробуйте позже.';
    }
  }

  async function handleAdminButtonClick() {
    try {
      // Упростили логику: сразу задаём роль 'admin'
      const user = { username: 'admin', role: 'admin' };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('currentUser', 'admin');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('isAuthenticated', 'true');

      role = 'admin'; // Обновляем локальную переменную role

      page.show('/admin');
    } catch (e) {
      console.error('Ошибка при работе с localStorage или навигации (Admin Button):', e);
      error = 'Произошла ошибка при попытке входа в админ‑панель.';
    }
  }
</script>

<div class="login-page">
  <div class="login-container">
    <div class="logo">
      <span class="logo-text">STLearn</span>
    </div>

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="username">Логин</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Введите ваш логин"
          bind:value={username}
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Введите ваш пароль"
          bind:value={password}
          required
        />
      </div>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <button type="submit" class="login-btn">Войти</button>
      <button
        type="button"
        class={adminBtnClasses}
        id="adminBtn"
        on:click={handleAdminButtonClick}
        disabled={role !== 'admin'}
      >
        🛡️ Вход администратора
      </button>
      <div id="adminHint" class="admin-hint" style:display={adminHintDisplay}>
        Администратор: вы ввели данные для входа в админ‑панель.
      </div>
    </form>
    <div class="footer">
      © 2026г. STLearn.
    </div>
  </div>
</div>


<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: linear-gradient(135deg, #f8fbff, #e6f7ff);
  }

  .login-container {
    background: white;
    color: #333;
    --brand-blue: #007BFF;
    /* На ~2 тона светлее, чем --brand-blue */
    --brand-blue-light-2: #B3D9FF;
    /* Ещё на ~2 тона светлее */
    --brand-blue-light-4: #E5F2FF;
    justify-content: center;
    align-items: center;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(12, 26, 214, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .logo {
    width: 120px;
    height: 120px;
    margin: 0 auto 30px;
    background: linear-gradient(135deg, #ffffff, #e6f7ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
    border: 2px solid #b3e0ff;
  }

  .logo-text {
    font-size: 28px;
    font-weight: 700;
    color: #007BFF;
    letter-spacing: -0.5px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  }

  .form-group {
    margin-bottom: 20px;
    text-align: left;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 600;
    font-size: 14px;
  }

  .form-group input {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    padding: 12px 15px;
    border: 1px solid rgb(183, 165, 216);
    border-radius: 8px;
    font-size: 16px;
    color: #333;
    caret-color: #333;
    background: linear-gradient(135deg, var(--brand-blue-light-4), var(--brand-blue-light-2));
    transition: border-color 0.3s;
  }

  .form-group input:focus {
    border-color: #0056b3;
    outline: none;
    box-shadow: none;
  }

  /* Chromium */
  .form-group input:-webkit-autofill,
  .form-group input:-webkit-autofill:hover,
  .form-group input:-webkit-autofill:focus,
  .form-group input:-webkit-autofill:active {
    -webkit-text-fill-color: #333 !important;
    caret-color: #333;
    box-shadow: 0 0 0px 1000px var(--brand-blue-light-4) inset !important;
  }

  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #007BFF, #0056b3);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.3s;
  }

  .login-btn:hover {
    background: linear-gradient(135deg, #0066cc, #004499);
  }

  .admin-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #28a745, #1e7e34);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    opacity: 0.7;
  }

  /* Классы для активного состояния админ‑кнопки */
  .admin-btn.active {
    opacity: 1;
    background: linear-gradient(135deg, #dc3545, #c82333);
  }


  .admin-btn.active:hover {
    background: linear-gradient(135deg, #c82333, #a71e2a);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }

  /* Стиль для неактивной кнопки, чтобы она выглядела серой */
  .admin-btn:disabled {
    background: #ccc;
    color: #666;
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
    box-shadow: none;
  }

  .footer {
    margin-top: 30px;
    font-size: 13px;
    color: #666;
  }

  .admin-hint {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }

  /* Стили для сообщения об ошибке */
  .error-message {
    color: #e74c3c;
    background: #feecec;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #f5c6cb;
    text-align: center;
    margin-bottom: 15px;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
</style>
