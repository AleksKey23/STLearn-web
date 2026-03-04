script>
  import page from 'page';
  import config from '../config.js'; 

  let username = '';
  let password = '';
  let error = '';

  // 1. Реактивно определяем, пытается ли пользователь войти как админ
  // Кнопка станет красной сразу, как только введут "admin"
  $: isEnteringAdmin = username.trim().toLowerCase() === 'admin';

  // 2. Классы и стили зависят от того, что введено в поле логина
  $: adminBtnClasses = isEnteringAdmin ? 'admin-btn active' : 'admin-btn';
  $: adminHintDisplay = isEnteringAdmin ? 'block' : 'none';

  async function handleSubmit(event) {
    // 1. Проверяем наличие event максимально просто
    if (event) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
    }
    
    error = '';

    // Валидация
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password.trim()) {
      error = 'Пожалуйста, заполните все поля';
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password: password })
      });

      const data = await response.json();

      if (response.ok) {
        const userRole = data.role || 'student';
        const user = { username: trimmedUsername, role: userRole };

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('isAuthenticated', 'true');

        if (userRole === 'admin') {
          page.show('/admin');
        } else {
          page.show('/mainbar');
        }
      } else {
        error = data.error || 'Неверный логин или пароль';
      }
    } catch (e) {
      console.error('Login error:', e);
      error = 'Ошибка соединения с сервером.';
    }
  }

  // Для красной кнопки используем ту же логику отправки, что и для синей
  function handleAdminButtonClick() {
    handleSubmit();
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
          placeholder="Введите ваш логин"
          bind:value={username}
          autocomplete="username" 
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          type="password"
          id="password"
          placeholder="Введите ваш пароль"
          bind:value={password}
          autocomplete="current-password"
          required
        />
      </div>

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <!-- Синяя кнопка активна только для обычных юзеров -->
      <button 
        type="submit" 
        class="login-btn" 
        disabled={isEnteringAdmin}
      >
        Войти
      </button>

      <!-- Красная кнопка активна только если логин "admin" -->
      <button
        type="button"
        class={adminBtnClasses}
        on:click={handleAdminButtonClick}
        disabled={!isEnteringAdmin}
      >
        🛡️ Вход администратора
      </button>

      <div class="admin-hint" style:display={adminHintDisplay}>
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

.login-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

  .admin-btn.active {
    opacity: 1;
    background: linear-gradient(135deg, #dc3545, #c82333);
  }

  .admin-btn.active:hover {
    background: linear-gradient(135deg, #c82333, #a71e2a);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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
