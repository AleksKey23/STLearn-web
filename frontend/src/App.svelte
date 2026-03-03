<script>
import Index from './routes/index.svelte';
let currentPage = Index;
  import page from 'page';


  // Импорты компонентов
  
  import Admin from './routes/admin.svelte';
  import Lectures from './routes/lectures.svelte';
  import Mainbar from './routes/mainbar.svelte';
  import Profile from './routes/profile.svelte';
  import Testing from './routes/testing.svelte';
  import LecBeso from './routes/lec-beso.svelte';
  import LecEmergency from './routes/lec-emergency.svelte';
  import LecFireproof from './routes/lec-fireproof.svelte';
  import LecPRRiRNV from './routes/lec-prrirnv.svelte';
  import LecSIZ from './routes/lec-siz.svelte';
  import TestTemplate from './routes/test-template/test-template.svelte';

  
  function getUser() {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.role) {
          return parsed;
        }
      } catch {

      }
    }

    // Старый формат: разрозненные ключи
    const username = localStorage.getItem('currentUser');
    const role = localStorage.getItem('userRole');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!username || !role || !isAuthenticated) {
      return null;
    }

    return { username, role };
  }

  // Регистрация маршрутов сразу при загрузке модуля
  page('/', () => {
    const user = getUser();
    if (user) {
      if (user.role === 'admin') {
        page.show('/admin');
      } else {
        page.show('/mainbar');
      }
    } else {
      currentPage = Index;
    }
  });

  page('/admin', () => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      page.show('/');
      return;
    }
    currentPage = Admin;
  });

  page('/mainbar', () => {
    const user = getUser();
    if (!user) {
      page.show('/');
      return;
    }
    currentPage = Mainbar;
  });

  // Остальные страницы — без защиты
  page('/lectures', () => { currentPage = Lectures; });
  page('/profile', () => { currentPage = Profile; });
  page('/testing', () => { currentPage = Testing; });
  page('/lec-beso', () => { currentPage = LecBeso; });
  page('/lec-emergency', () => { currentPage = LecEmergency; });
  page('/lec-fireproof', () => { currentPage = LecFireproof; });
  page('/lec-prrirnv', () => { currentPage = LecPRRiRNV; });
  page('/lec-siz', () => { currentPage = LecSIZ; });
  page('/test-template', () => { currentPage = TestTemplate; });

  // Страница 404 (любой другой маршрут)
  page('*', () => {
    currentPage = null;
  });

  // Запуск роутера — после всех обработчиков
  page.start();
</script>

<main class="app-main">
  {#if currentPage}
    <svelte:component this={currentPage} />
  {:else}
    <!-- Страница 404 -->
    <div style="text-align: center; padding: 2rem;">
      <h2>Страница не найдена</h2>
      <p>
        Перейдите на
        <a href="/" on:click|preventDefault={() => page.show('/')}>
          главную страницу
        </a>
      </p>
    </div>
  {/if}
</main>
