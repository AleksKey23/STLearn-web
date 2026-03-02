<script>
  import { onMount } from 'svelte';
  import page from 'page';

  let currentPage = 'home';

  function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    page('/');
  }

  let isSidebarVisible = false;

  onMount(() => {
    page('/', () => {
      currentPage = 'home';
    });

    page('/profile', () => {
      currentPage = 'profile';
    });

    page('/lectures', () => {
      currentPage = 'lectures';
    });

    page('/testing', () => {
      currentPage = 'testing';
    });

    // Обработка маршрута /mainbar
    page('/mainbar', () => {
      currentPage = 'home';
    });

    // Запуск маршрутизатора
    page.start();
  });
</script>

<div class="app-container">
  <button on:click={handleLogout} class="logout-btn">Выйти</button>

  <div class="layout">
    <!-- Боковое меню -->
    <aside class="sidebar">
      <button
        type="button"
        on:click={() => page('/profile')}
        class:active={currentPage === 'profile'}
        class="nav-item stlearn-menu-item"
      >
        <span>👤</span> Личный кабинет
      </button>
      <button
        type="button"
        on:click={() => page('/lectures')}
        class:active={currentPage === 'lectures'}
        class="nav-item stlearn-menu-item"
      >
        <span>🎓</span> Лекции
      </button>
      <button
        type="button"
        on:click={() => page('/testing')}
        class:active={currentPage === 'testing'}
        class="nav-item stlearn-menu-item"
      >
        <span>📝</span> Тестирование
      </button>
    </aside>

    
    <!-- Центральная область -->
  <main class="main-content">
    <div class="logo">
      <span class="logo-text">STLearn</span>
    </div>
    <div class="content-panel">
      <p>Добро пожаловать на платформу STLearn.</p>
      <p>Выберите раздел слева, чтобы перейти к лекциям или тестированию.</p>
    </div>
  </main>

  </div>
</div>


<style>
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-container {
  min-height: 100vh;
  position: relative;
  animation: fadeIn 1s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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
}

.logout-btn:hover {
  background: linear-gradient(45deg, #e90e24, #790a0a);
      transform: translateX(4px);
}

.layout {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 48px); /* Учитываем высоту кнопки */
  align-items: stretch;
  gap: 24px;
  padding: 24px 32px;
  background-color: #f0f8ff; /* Светлый фон, как на исходной странице */
}

/* Боковое меню слева (упрощённый дизайн) */
.sidebar {
  width: 240px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 10;
  transition: all 0.3s ease;
}

.stlearn-menu-item {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: rgb(255, 255, 255);;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #4088d4, #96bfe2 );
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.stlearn-menu-item:hover {
  background: linear-gradient(135deg, #0066cc, #004499);
  border-color: #007BFF;
}

.stlearn-menu-item.active {
  background-color: #007BFF;
  color: #ffffff;
  border-color: #007BFF;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
}

.main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
    }

    .logo {
      width: 160px;
      height: 160px;
      margin: 0 auto 60px;
      background: linear-gradient(135deg, #ffffff, #e6f7ff);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(0, 123, 255, 0.2);
      border: 2px solid #b3e0ff;
      z-index: 5;
    }

    .logo-text {
      font-size: 36px;
      font-weight: 800;
      color: #007BFF;
      letter-spacing: -1px;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.05);
    }

    .content-panel {
      width: 100%;
      max-width: 800px;
      text-align: center;
      color: #555;
      font-size: 18px;
      line-height: 1.6;
      opacity: 0.8;
    }

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    padding: 16px 24px;
    gap: 16px;
  }

  .sidebar {
    width: 100%;
    max-width: none;
  }

  .logout-btn {
    top: 16px;
    right: 24px;
  }

.main-content {
        padding-top: 80px;
      }

      .logo {
        width: 140px;
        height: 140px;
      }

      .logo-text {
        font-size: 30px;
      }
  }

</style>
