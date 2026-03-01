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
        // Обновляем статус локально (ID 4 — лекция по ООПМП)
        updateLectureStatusLocal(4, true);
        page('/lectures');
      } else {
        console.log('Пользователь отменил подтверждение');
      }
    } catch (error) {
      console.error('Ошибка при подтверждении:', error);
      page('/lectures');
    }
  }

  // Обработчик клавиш — выполняется только на клиенте
  onMount(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    const handleKeydown = (e) => {
      if (e.key === 'Home') {
        window.scrollTo(0, 0);
      } else if (e.key === 'End') {
        window.scrollTo(0, document.body.scrollHeight);
      }
    };

    // Добавляем обработчик событий
    document.addEventListener('keydown', handleKeydown);

    // Очистка: удаляем обработчик при уничтожении компонента
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

   
   <div class="container">
    <div class="logo">
      <div class="logo-text">STLearn</div>
    </div>

    <h1>Основы оказания первой медицинской помощи</h1>

    <div class="lecture-info">
      <h2>Содержание лекции:</h2>
      <ul>
        <li>Принципы безопасного подхода к пострадавшему</li>
        <li>Алгоритм оценки ситуации и состояния пострадавшего</li>
        <li>Остановка кровотечений и повязки</li>
        <li>Искусственное дыхание и непрямой массаж сердца</li>
        <li>Помощь при ожогах, переломах и обмороках</li>
        <li>Действия при отравлениях и аллергических реакциях</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>1. Принципы безопасного подхода</h2>
      
      <h3>1.1 Правило «Безопасность прежде всего»</h3>
      <p>Перед тем как помочь пострадавшему, убедитесь, что вы не становитесь второй жертвой.</p>
      
      <ul>
        <li>Проверьте наличие угроз: ток, огонь, падающие конструкции, агрессивные люди</li>
        <li>Не подходите к месту ДТП без включённых аварийных огней и разметки</li>
        <li>Используйте перчатки и маску при контакте с кровью или биологическими жидкостями</li>
        <li>Если угроза сохраняется — вызовите спасателей, не рискуйте сами</li>
      </ul>

      <div class="warning">
        <strong>Важно:</strong> Более 15% спасателей получают травмы, пытаясь помочь в небезопасной обстановке. Оценка риска — обязательный первый шаг.
      </div>
    </div>

    <div class="content-section">
      <h2>2. Оценка состояния пострадавшего</h2>
      
      <h3>2.1 Алгоритм ABCDE</h3>
      <p>Используйте систему ABCDE для быстрой оценки угрожающих жизни состояний:</p>
      
      <ul>
        <li><strong>A — Airway (Дыхательные пути):</strong> Открыт ли проход? Есть ли инородные тела?</li>
        <li><strong>B — Breathing (Дыхание):</strong> Дышит ли человек? Наблюдайте за грудной клеткой</li>
        <li><strong>C — Circulation (Кровообращение):</strong> Есть ли пульс на сонной артерии? Кожа бледная или синюшная?</li>
        <li><strong>D — Disability (Неврологический статус):</strong> Реагирует ли на голос? Повторяет ли фразы?</li>
        <li><strong>E — Exposure (Экспозиция):</strong> Осмотрите тело на травмы, кровотечения, ожоги — но не переохлаждайте!</li>
      </ul>

      <h3>2.2 Как проверить сознание?</h3>
      <p>Громко спросите: «Вы меня слышите?» + лёгкое постукивание по плечу. Если нет реакции — считайте, что человек без сознания.</p>
    </div>

    <div class="content-section">
      <h2>3. Остановка кровотечений и наложение повязок</h2>
      
      <h3>3.1 Виды кровотечений</h3>
      <ul>
        <li><strong>Артериальное:</strong> Ярко-красная струя, пульсирует — срочно! Давите выше раны</li>
        <li><strong>Венозное:</strong> Тёмная, равномерная струя — давите на рану</li>
        <li><strong>Капиллярное:</strong> Медленное просачивание — достаточно чистой повязки</li>
      </ul>

      <h3>3.2 Алгоритм остановки кровотечения</h3>
      <ol>
        <li>Наденьте перчатки</li>
        <li>Прижмите рану чистой тканью или салфеткой</li>
        <li>Поднимите конечность выше уровня сердца (если нет перелома)</li>
        <li>Если не останавливается — наложите жгут (только при артериальном кровотечении)</li>
        <li>Запишите время наложения жгута — каждые 45–60 минут ослабляйте на 1–2 минуты</li>
      </ol>

      <div class="important-note">
        <strong>Запомните:</strong> Жгут — крайняя мера! Используйте только при угрозе жизни, если давление не помогает.
      </div>
    </div>

    <div class="content-section">
      <h2>4. Искусственное дыхание и непрямой массаж сердца</h2>
      
      <h3>4.1 Алгоритм СЛР (сердечно-лёгочная реанимация)</h3>
      <p>Для взрослых — по рекомендациям ERC 2025:</p>
      
      <ol>
        <li>Убедитесь, что человек без сознания и не дышет</li>
        <li>Вызовите скорую (или попросите кого-то сделать это)</li>
        <li>Начните непрямой массаж сердца: 30 надавливаний</li>
        <li>2 вдоха: запрокиньте голову, зажмите нос, закройте рот пострадавшего и дуйте 1 секунду</li>
        <li>Повторяйте цикл 30:2 до прибытия медиков или восстановления дыхания</li>
      </ol>

      <h3>4.2 Особенности СЛР у детей и новорождённых</h3>
      <ul>
        <li><strong>Дети (1–12 лет):</strong> 15:2, давление ладонями двух пальцев</li>
        <li><strong>Новорождённые:</strong> 3:1, давление двумя пальцами на нижнюю треть грудины</li>
        <li>Во всех случаях — сначала 5 начальных вдохов, если ребёнок не дышит</li>
      </ul>

      <div class="warning">
        <strong>Важно:</strong> Если вы не обучены искусственному дыханию — делайте только непрямой массаж сердца. Это лучше, чем ничего.
      </div>
    </div>

    <div class="content-section">
      <h2>5. Помощь при ожогах, переломах и обмороках</h2>
      
      <h3>5.1 Ожоги</h3>
      <ul>
        <li><strong>1-й степени:</strong> Краснота — охладить водой 10–15 мин</li>
        <li><strong>2-й степени:</strong> Волдыри — не вскрывать! Накрыть стерильной салфеткой</li>
        <li><strong>3-й и выше:</strong> Никаких мазей, льда, масла! Вызовите скорую, накройте чистой тканью</li>
      </ul>

      <h3>5.2 Переломы</h3>
      <ul>
        <li>Не пытайтесь вправить кость</li>
        <li>Зафиксируйте конечность с помощью шины (доска, журнал, скотч)</li>
        <li>Если перелом открытый — прикройте рану стерильной повязкой</li>
        <li>Не давайте еду/питьё — возможна операция</li>
      </ul>

      <h3>5.3 Обморок</h3>
      <ul>
        <li>Уложите пострадавшего на спину, поднимите ноги выше уровня головы</li>
        <li>Расстегните воротник, обеспечьте приток воздуха</li>
        <li>Не давайте пахнуть аммиаком — это устаревший и опасный метод</li>
        <li>Если не приходит в сознание через 1–2 минуты — начинайте СЛР</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>6. Действия при отравлениях и аллергических реакциях</h2>
      
      <h3>6.1 Отравления</h3>
      <ul>
        <li>Не вызывайте рвоту — это может усугубить повреждение пищевода</li>
        <li>Соберите упаковку/остатки вещества — это критически важно для врачей</li>
        <li>Если отравление газом — вынесите человека на свежий воздух</li>
        <li>При пищевом отравлении — давайте питьё, если человек в сознании</li>
      </ul>

      <h3>6.2 Анафилактический шок</h3>
      <ul>
        <li>Симптомы: отёк губ/языка, затруднённое дыхание, сыпь, падение давления</li>
        <li>Если есть адреналиновая авторучка (эпипен) — используйте немедленно в бедро</li>
        <li>Положите человека на спину, поднимите ноги</li>
        <li>Вызовите скорую — даже если стало легче, шок может вернуться</li>
      </ul>

      <div class="important-note">
        <strong>Запомните:</strong> Время при ответе на анафилаксию — 5 минут. Адреналин спасает жизнь, а не просто снимает симптомы.
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

    .confirm-btn {
      display: block;
      background-color: #28a745; /* Зелёный цвет как в лекции про СИЗ */
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.1s;
      margin: 30px auto;
      font-size: 1.1em;
      text-align: center;
      max-width: 300px;
      box-shadow: 0 3px 8px rgba(40, 167, 69, 0.3);
    }

    .confirm-btn:hover {
      background-color: #218838;
      transform: translateY(-2px);
    }

    .confirm-btn:active {
      transform: translateY(1px);
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
      .confirm-btn {
        padding: 12px 25px;
        font-size: 1em;
        max-width: 250px;
      }
    } 
</style>