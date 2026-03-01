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
        // Обновляем статус локально (ID 3 — лекция по Пожарной безопасности)
        updateLectureStatusLocal(3, true);
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

    <h1>Пожарная безопасность на складе</h1>

    <div class="lecture-info">
      <h2>Содержание лекции:</h2>
      <ul>
        <li>Основные причины возникновения пожаров на складах</li>
        <li>Классификация пожароопасных зон и материалов</li>
        <li>Требования к противопожарным преградам и эвакуационным путям</li>
        <li>Правила хранения горючих и легковоспламеняющихся веществ</li>
        <li>Оборудование для пожаротушения и его обслуживание</li>
        <li>Действия персонала при пожаре и эвакуации</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>1. Основные причины пожаров на складах</h2>
      
      <h3>1.1 Наиболее частые источники возгорания</h3>
      <p>Анализ аварийных ситуаций показывает, что основные причины пожаров связаны с нарушением правил эксплуатации оборудования и хранения материалов.</p>
      
      <ul>
        <li>Неисправность электропроводки и электрооборудования</li>
        <li>Использование открытого огня (зажигалки, сигареты)</li>
        <li>Трение и искрообразование при работе техники</li>
        <li>Самовозгорание материалов при неправильном хранении</li>
        <li>Нарушение технологии сварочных и других огневых работ</li>
      </ul>

      <div class="warning">
        <strong>Важно:</strong> Более 60% пожаров на складах происходят по вине персонала — из-за несоблюдения инструкций и халатности.
      </div>
    </div>

    <div class="content-section">
      <h2>2. Классификация пожароопасных зон</h2>
      
      <h3>2.1 Классы пожароопасных материалов</h3>
      <p>Согласно ППБ 01-03, материалы делятся на классы по степени пожарной опасности:</p>
      
      <ul>
        <li><strong>Класс А:</strong> Твердые горючие материалы (дерево, бумага, текстиль)</li>
        <li><strong>Класс В:</strong> Жидкие горючие и плавящиеся вещества (бензин, масла, клеи)</li>
        <li><strong>Класс С:</strong> Газообразные горючие вещества (пропан, бутан)</li>
        <li><strong>Класс D:</strong> Горючие металлы (магний, алюминий в порошке)</li>
        <li><strong>Класс Е:</strong> Электроустановки под напряжением</li>
        <li><strong>Класс F:</strong> Жиры и масла в кулинарных установках</li>
      </ul>

      <h3>2.2 Зоны с повышенной пожарной опасностью</h3>
      <ul>
        <li>Зоны хранения ЛВЖ и ГЖ</li>
        <li>Электрощитовые и кабельные каналы</li>
        <li>Зоны проведения огневых работ</li>
        <li>Помещения с отопительным оборудованием</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>3. Противопожарные преграды и эвакуация</h2>
      
      <h3>3.1 Требования к проходам и выходам</h3>
      <p>Эвакуационные пути должны быть свободны в любое время суток.</p>
      
      <ul>
        <li>Ширина проходов — не менее 1,2 м</li>
        <li>Эвакуационные выходы — не менее двух, с разными направлениями</li>
        <li>Двери эвакуационных выходов — должны открываться наружу</li>
        <li>Запрещено складировать материалы у выходов и пожарных кранов</li>
      </ul>

      <h3>3.2 Противопожарные преграды</h3>
      <p>Стены, перекрытия и перегородки, ограничивающие распространение огня, должны соответствовать нормам огнестойкости.</p>
      <p>Огнестойкость конструкций — не менее 150 минут в зонах хранения опасных материалов.</p>
    </div>

    <div class="content-section">
      <h2>4. Хранение горючих веществ</h2>
      
      <h3>4.1 Правила хранения ЛВЖ и ГЖ</h3>
      <p>Жидкие и газообразные горючие материалы требуют особого подхода.</p>
      
      <ul>
        <li>Хранение только в специализированных складах с вентиляцией</li>
        <li>Использование герметичных емкостей, маркированных по ГОСТ</li>
        <li>Размещение в зонах с противопожарными перегородками</li>
        <li>Запрещено хранить рядом с источниками тепла и электроприборами</li>
      </ul>

      <div class="important-note">
        <strong>Запомните:</strong> Не допускается хранение более 24 часов ЛВЖ в рабочих зонах — только в специальных пожароустойчивых шкафах.
      </div>
    </div>

    <div class="content-section">
      <h2>5. Средства пожаротушения и их обслуживание</h2>
      
      <h3>5.1 Типы огнетушителей на складе</h3>
      <ul>
        <li><strong>Порошковые (ОП):</strong> Для классов A, B, C, E — универсальные</li>
        <li><strong>Углекислотные (ОУ):</strong> Для классов B, E — без следов, подходит для электрощитов</li>
        <li><strong>Водяные (ОВ):</strong> Только для класса A — НЕ для электроприборов и ЛВЖ</li>
        <li><strong>Пеновые (ОПС):</strong> Для классов A, B — но не для металлов и электрики</li>
      </ul>

      <h3>5.2 Требования к обслуживанию</h3>
      <ul>
        <li>Проверка давления — ежемесячно</li>
        <li>Перезарядка — не реже 1 раза в год</li>
        <li>Расположение — в доступных местах, с яркой маркировкой</li>
        <li>Расстояние до очага — не более 20 м для порошковых, 30 м для углекислотных</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>6. Действия при пожаре и эвакуация</h2>
      
      <h3>6.1 Алгоритм действий персонала</h3>
      <p>При обнаружении пожара необходимо действовать по следующему плану:</p>
      
      <ol>
        <li>Немедленно сообщить о пожаре по внутреннему номеру или кнопке пожарной сигнализации</li>
        <li>Попытаться ликвидировать очаг при помощи огнетушителя — только если это безопасно</li>
        <li>Эвакуировать персонал по заранее проложенным маршрутам</li>
        <li>Перекрыть подачу газа, электропитания, если возможно</li>
        <li>Дождаться прибытия пожарных и передать им информацию о типе горящего материала</li>
      </ol>

      <h3>6.2 Запрещенные действия</h3>
      <ul>
        <li>Использовать лифты при пожаре</li>
        <li>Возвращаться за личными вещами</li>
        <li>Открывать двери, если на них тепло — это признак огня за ними</li>
        <li>Тушить водой горючие жидкости или электроприборы под напряжением</li>
      </ul>

      <div class="warning">
        <strong>Важно:</strong> Пожар на складе может распространиться за 3–5 минут. Каждая секунда на счету!
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