<script>
  import { onMount } from 'svelte';
  import page from 'page';
  import { updateLectureStatusLocal } from '../stores.js';

  // Функция подтверждения изучения
  async function confirmStudy() {
    try {
      const userConfirmed = confirm('Вы уверены, что полностью изучили лекцию?');

      if (userConfirmed) {
        console.log('Пользователь подтвердил изучение лекции');
        // Обновляем статус локально (ID 2 — лекция по БЕСО)
        updateLectureStatusLocal(2, true);
        page('/lectures');
      } else {
        console.log('Пользователь отменил подтверждение');
      }
    } catch (error) {
      console.error('Ошибка при подтверждении:', error);
      page('/lectures');
    }
  }

  // Обработчики клавиш для навигации — только на клиенте
  onMount(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Home') {
        window.scrollTo(0, 0);
      } else if (e.key === 'End') {
        window.scrollTo(0, document.body.scrollHeight);
      }
    });

    // Очистка обработчика при уничтожении компонента
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  function handleKeydown(e) {
    if (e.key === 'Home') {
      window.scrollTo(0, 0);
    } else if (e.key === 'End') {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
</script>
   
   <div class="container">
    <div class="logo">
      <div class="logo-text">STLearn</div>
    </div>

    <h1>Безопасная эксплуатация складского оборудования</h1>

    <div class="lecture-info">
      <h2>Содержание лекции:</h2>
      <ul>
        <li>Общие требования безопасности при работе со складским оборудованием</li>
        <li>Правила эксплуатации погрузчиков и штабелеров</li>
        <li>Требования к складским стеллажам и системам хранения</li>
        <li>Опасные факторы и меры защиты</li>
        <li>Процедуры технического обслуживания и ремонта</li>
        <li>Действия в аварийных ситуациях</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>1. Общие требования безопасности</h2>
      
      <h3>1.1 Основные принципы безопасности</h3>
      <p>Эксплуатация складского оборудования требует строгого соблюдения правил безопасности для предотвращения травматизма и аварийных ситуаций.</p>
      
      <div class="important-note">
        <strong>Важно:</strong> Все сотрудники должны пройти обязательное обучение и инструктаж перед допуском к работе с оборудованием.
      </div>

      <h3>1.2 Обязанности персонала</h3>
      <ul>
        <li>Знать и соблюдать правила эксплуатации оборудования</li>
        <li>Проверять техническое состояние перед началом работы</li>
        <li>Использовать средства индивидуальной защиты</li>
        <li>Немедленно сообщать о неисправностях руководству</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>2. Погрузчики и штабелеры</h2>
      
      <h3>2.1 Требования к операторам</h3>
      <p>Операторы погрузчиков должны иметь соответствующую квалификацию и документы, подтверждающие право управления техникой.</p>

      <h3>2.2 Правила эксплуатации</h3>
      <ul>
        <li>Проверка технического состояния перед началом смены</li>
        <li>Соблюдение грузоподъемности оборудования</li>
        <li>Обеспечение устойчивости груза при перемещении</li>
        <li>Соблюдение скоростного режима на территории склада</li>
      </ul>

      <div class="warning">
        <strong>Предупреждение:</strong> Запрещается эксплуатация неисправного оборудования и перегрузка техники сверх установленных норм.
      </div>
    </div>

    <div class="content-section">
      <h2>3. Стеллажные системы хранения</h2>
      
      <h3>3.1 Требования к монтажу и эксплуатации</h3>
      <p>Стеллажные системы должны соответствовать проектной документации и нормативным требованиям.</p>

      <h3>3.2 Контроль состояния</h3>
      <ul>
        <li>Регулярный осмотр на предмет деформаций</li>
        <li>Контроль креплений и соединений</li>
        <li>Проверка равномерности распределения нагрузки</li>
        <li>Своевременное устранение повреждений</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>4. Опасные факторы и защита</h2>
      
      <h3>4.1 Основные опасности</h3>
      <p>При работе со складским оборудованием возможны следующие опасные ситуации:</p>
      <ul>
        <li>Падение грузов</li>
        <li>Опрокидывание техники</li>
        <li>Столкновения с препятствиями</li>
        <li>Поражение электрическим током</li>
      </ul>

      <h3>4.2 Меры защиты</h3>
      <ul>
        <li>Использование защитных ограждений</li>
        <li>Применение сигнальных систем</li>
        <li>Обеспечение достаточного освещения</li>
        <li>Соблюдение зон безопасности</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>5. Техническое обслуживание</h2>
      
      <h3>5.1 Плановое обслуживание</h3>
      <p>Все виды оборудования должны проходить регулярное техническое обслуживание согласно установленному графику.</p>

      <h3>5.2 Процедуры ремонта</h3>
      <ul>
        <li>Ремонт выполняется только квалифицированным персоналом</li>
        <li>Обязательное отключение от электросети при ремонте</li>
        <li>Использование только оригинальных запчастей</li>
        <li>Тестирование оборудования после ремонта</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>6. Действия в аварийных ситуациях</h2>
      
      <h3>6.1 Порядок действий</h3>
      <p>При возникновении аварийной ситуации необходимо:</p>
      <ul>
        <li>Немедленно остановить работу оборудования</li>
        <li>Обеспечить безопасность персонала</li>
        <li>Сообщить руководителю о происшествии</li>
        <li>При необходимости вызвать emergency службы</li>
      </ul>

      <h3>6.2 Первая помощь</h3>
      <p>Все сотрудники должны быть обучены основам оказания первой помощи при несчастных случаях.</p>

      <div class="important-note">
        <strong>Запомните:</strong> Безопасность персонала всегда должна быть приоритетом при любых операциях со складским оборудованием.
      </div>
    </div>

    <!-- Секция с видео -->
<div class="video-section">
  <h2>Видеоматериал по теме</h2>
  <div class="video-container">
    <video
      controls
      width="640"
      height="360"
      preload="metadata"
    >
      <source src="/BESO.mp4" type="video/mp4">
      <p>Ваш браузер не поддерживает видео тег. <a href="/BESO.mp4">Скачать видео</a></p>
    </video>
  </div>
</div>

    <button class="confirm-btn" on:click={confirmStudy}>Подтвердить изучение</button>

    <div class="footer">
      &copy; 2026г. STLearn.
    </div>
  </div>

<style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      animation: fadeIn 1s ease-out;
    }

    @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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

    h1 {
      color: #0d6efd;
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #e9ecef;
      padding-bottom: 15px;
      font-size: 2.2rem;
    }

    .lecture-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 25px;
      border-left: 4px solid #007BFF;
    }

    .lecture-info h2 {
      color: #0d6efd;
      margin-bottom: 10px;
      font-size: 1.4rem;
    }

    .lecture-info ul {
      padding-left: 20px;
    }

    .lecture-info li {
      margin-bottom: 8px;
    }

    .content-section {
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9ecef;
    }

    .content-section h2 {
      color: #0d6efd;
      margin-bottom: 15px;
      font-size: 1.5rem;
      padding-left: 15px;
      border-left: 4px solid #007BFF;
    }

    .content-section h3 {
      color: #495057;
      margin: 20px 0 10px 0;
      font-size: 1.2rem;
    }

    .content-section p {
      margin-bottom: 15px;
      text-align: justify;
    }

    .content-section ul {
      margin: 15px 0;
      padding-left: 30px;
    }

    .content-section li {
      margin-bottom: 8px;
    }

    .important-note {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 5px 5px 0;
    }

    .warning {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 5px 5px 0;
    }

    /* Стили для видео-секции */
    .video-section {
      margin: 40px 0;
      padding: 30px 0;
      border-top: 2px solid #e9ecef;
      border-bottom: 2px solid #e9ecef;
    }

    .video-section h2 {
      color: #0d6efd;
      text-align: center;
      margin-bottom: 25px;
      font-size: 1.8rem;
    }

    .video-container {
      position: relative;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .video-container video {
      width: 100%;
      height: auto;
      display: block;
    }

    .confirm-btn {
      display: block;
      background-color: #28a745;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
      margin: 30px auto;
      font-size: 1.1em;
      text-align: center;
      max-width: 300px;
    }

    .confirm-btn:hover {
      background-color: #218838;
    }

    .footer {
      text-align: center;
      margin-top: 40px;
      color: #6c757d;
      font-size: 0.9em;
      border-top: 1px solid #e9ecef;
      padding-top: 20px;
    }

    @media (max-width: 600px) {
      .container {
        padding: 20px;
      }
      .logo {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
      }
      .logo-text {
        font-size: 24px;
      }
      h1 {
        font-size: 1.8rem;
      }
      .lecture-info {
        padding: 15px;
      }
      .video-section h2 {
        font-size: 1.5rem;
      }
      .confirm-btn {
        padding: 12px 25px;
        font-size: 1em;
        max-width: 250px;
      }
    }
</style>