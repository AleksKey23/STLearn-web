<script>
  import { onMount, onDestroy } from 'svelte';
  import Question from './components/Question.svelte';
  import Results from './components/Results.svelte';
  import Timer from './components/Timer.svelte';
  import { saveTestCompletion } from '../../completed.js';

  export let testId; // Убираем локальное объявление testId = 1

  // Константы
  const DEFAULT_TIME = 600; // 10 минут
  const PASS_THRESHOLD = 80; // Проходной балл в %


  // Текстовые константы для локализации
  const texts = {
    noAnswer: 'Пожалуйста, выберите ответ перед переходом.',
    passed: '✅ Вы успешно прошли тест.',
    failed: '❌ К сожалению, вы не прошли тест. Вы можете попробовать пересдать этот тест или вернуться ко всем тестам, а также перейти к лекциям для повторного изучения теоретического материала ',
    back: 'Назад',
    next: 'Далее',
    finish: 'Завершить тест',
    returnToTests: 'Вернуться к тестам'
  };

  // Состояние теста
    let testTitle = 'Тест';
    let test = null;
    let questions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let score = 0;
    let timeLeft = DEFAULT_TIME;
    let timerInterval = null;
    let showResult = false;
    let resultMessage = '';
    let percentage = 0;
    let isLoading = true;
    let isProcessing = false; // Индикатор обработки

  // Данные тестов
  const testsData = {
      1: {
        title: "Средства индивидуальной защиты",
        questions: [
          {
            question: "Какой из перечисленных СИЗ предназначен для защиты органов дыхания от пыли, аэрозолей и газов?",
            options: ["Защитные очки", "Слуховые защитные наушники", "Респиратор", "Защитные перчатки"],
            correct: 2
          },
          {
            question: "Какой класс респиратора обеспечивает защиту от токсичных газов и паров?",
            options: ["FP1", "FP2", "FP3", "РП-3"],
            correct: 3
          },
          {
            question: "Какой срок службы одноразового респиратора при использовании на складе?",
            options: ["До 8 часов", "До 12 часов", "До 24 часов", "До замены по загрязнению или повреждению"],
            correct: 3
          },
          {
            question: "Какие перчатки следует использовать при работе с кислотами?",
            options: ["Хлопковые", "Латексные", "Нитриловые", "Резиновые (каучуковые)"],
            correct: 3
          },
          {
            question: "Какой СИЗ защищает от ударов, брызг расплавленного металла и механических повреждений глаз?",
            options: ["Слуховые защитные наушники", "Защитные очки", "Щиток для лица", "Каска"],
            correct: 2
          },
          {
            question: "Что НЕ является обязательным при использовании защитного костюма?",
            options: ["Плотное прилегание к телу", "Отсутствие повреждений", "Наличие карманов для инструментов", "Совместимость с другими СИЗ"],
            correct: 2
          },
          {
            question: "Как часто проводится проверка исправности защитных очков?",
            options: ["Ежедневно перед началом работы", "Раз в месяц", "При каждом замечании повреждения", "Только при выдаче"],
            correct: 2
          },
          {
            question: "Какой СИЗ используется для защиты от шума при работе с погрузчиками?",
            options: ["Респиратор", "Защитные очки", "Слуховые защитные наушники", "Защитные перчатки"],
            correct: 2
          },
          {
            question: "Что необходимо сделать перед использованием респиратора с фильтром?",
            options: ["Проверить герметичность уплотнения на лице", "Промыть фильтр водой", "Нагреть фильтр до 50°C", "Снять с него упаковку только после начала работы"],
            correct: 0
          },
          {
            question: "Какой из перечисленных СИЗ не требует сертификации в соответствии с ГОСТ Р 12.4.283-2019?",
            options: ["Защитные очки", "Респиратор", "Защитные перчатки", "Кепка"],
            correct: 3
          }
        ]
      },
      2: {
        title: "Безопасная эксплуатация складского оборудования",
        questions: [
          {
            question: "Какой документ обязателен для оператора погрузчика перед началом работы?",
            options: ["Диплом о высшем образовании", "Удостоверение на право управления", "Паспорт транспортного средства", "Справка о состоянии здоровья"],
            correct: 1
          },
          {
            question: "Что необходимо проверить перед включением погрузчика?",
            options: ["Цвет кузова", "Наличие звука магнитолы", "Исправность тормозов и рулевого управления", "Количество топлива в баке"],
            correct: 2
          },
          {
            question: "Можно ли поднимать груз выше уровня глаз при движении погрузчика?",
            options: ["Да, если водитель уверенно управляет", "Нет, груз должен быть ниже уровня глаз", "Только при наличии помощника", "Да, если груз легкий"],
            correct: 1
          },
          {
            question: "Какое расстояние должно быть между погрузчиком и стеной при штабелировании?",
            options: ["Не менее 1 метра", "Не менее 0,5 метра", "Не менее 2 метров", "Не регламентируется"],
            correct: 0
          },
          {
            question: "Что делать, если погрузчик начал опрокидываться?",
            options: ["Прыгать с него", "Держаться за руль, прижаться к спинке и не двигаться", "Выключить двигатель и бежать", "Открыть дверь и выскочить"],
            correct: 1
          },
          {
            question: "Какой тип погрузчика запрещён для использования на улице при сильном ветре?",
            options: ["Электрический", "Дизельный", "Газовый", "Ручной"],
            correct: 0
          },
          {
            question: "Какой сигнал подаётся при движении погрузчика задним ходом?",
            options: ["Звуковой сигнал", "Мигание фар", "Поднятая рука", "Ничего не подаётся"],
            correct: 0
          },
          {
            question: "Что делать, если на пути погрузчика появился человек?",
            options: ["Продолжить движение, если человек в стороне", "Остановиться и дождаться, пока человек уйдёт", "Проехать быстрее", "Подать сигнал и продолжить"],
            correct: 1
          },
          {
            question: "Как часто проводится техническое обслуживание погрузчика?",
            options: ["Раз в месяц", "После каждой смены", "По графику, установленному производителем", "Только при поломке"],
            correct: 2
          },
          {
            question: "Какие действия запрещены при работе с погрузчиком?",
            options: ["Перевозить грузы выше разрешённой высоты", "Использовать погрузчик для подъёма людей", "Загружать грузы с перекосом", "Все перечисленные действия"],
            correct: 3
          }
        ]
      },
      3: {
        title: "Пожарная безопасность на складе",
        questions: [
          {
            question: "Какой класс пожара относится к горючим жидкостям (бензин, масла, растворители)?",
            options: ["A", "B", "C", "D"],
            correct: 1
          },
          {
            question: "Какой тип огнетушителя применяется для тушения пожаров класса A (твердые вещества)?",
            options: ["Порошковый", "Углекислотный", "Водяной", "Пеный"],
            correct: 2
          },
          {
            question: "Какой огнетушитель НЕ следует использовать при пожаре электрооборудования под напряжением?",
            options: ["Порошковый", "Углекислотный", "Водяной", "Пеный"],
            correct: 2
          },
          {
            question: "Какое минимальное расстояние должно быть между стеллажами с горючими материалами и источниками тепла?",
            options: ["0,5 м", "1 м", "1,5 м", "2 м"],
            correct: 3
          },
          {
            question: "Что делать при обнаружении возгорания на складе?",
            options: ["Срочно эвакуироваться и вызвать пожарных", "Попытаться потушить самому", "Закрыть дверь и ждать", "Включить вентиляцию"],
            correct: 0
          },
          {
            question: "Какие материалы нельзя хранить вместе с кислотами?",
            options: ["Металлы", "Пластик", "Щелочи", "Дерево"],
            correct: 2
          },
          {
            question: "Какой знак обозначает место хранения огнетушителей?",
            options: ["Красный квадрат с белым огнетушителем", "Зелёный кружок", "Жёлтый треугольник", "Синий прямоугольник"],
            correct: 0
          },
          {
            question: "Какой документ регламентирует требования пожарной безопасности на складах в РФ?",
            options: ["ГОСТ Р 12.4.283", "ППБ 01-03", "СНиП 2.08.02", "ТКП 45-2.04-218"],
            correct: 1
          },
          {
            question: "Как часто должна проводиться проверка исправности огнетушителей?",
            options: ["Ежедневно", "Раз в месяц", "Раз в год", "Раз в 6 месяцев"],
            correct: 3
          },
          {
            question: "Какое максимальное количество огнетушителей должно быть на 100 м² склада?",
            options: ["1", "2", "3", "4"],
            correct: 1
          }
        ]
      },
      4: {
        title: "Основы оказания первой медицинской помощи",
        questions: [
          {
            question: "Какие действия необходимо выполнить при обнаружении человека без сознания?",
            options: ["Потрясти и окликнуть", "Проверить дыхание и пульс", "Дать воду", "Перевернуть на живот"],
            correct: 1
          },
          {
            question: "Как остановить артериальное кровотечение?",
            options: ["Наложить жгут выше места ранения", "Прижать рану рукой", "Промыть водой", "Наложить давящую повязку"],
            correct: 0
          },
          {
            question: "Как правильно оказать помощь при ожоге 1-2 степени?",
            options: ["Смазать маслом", "Проколоть пузыри", "Охладить водой 10–15 минут", "Закрыть бинтом"],
            correct: 2
          },
          {
            question: "Что делать при обмороке?",
            options: ["Уложить на спину, приподнять ноги", "Дать пощёчину", "Накрыть одеялом", "Дать сильный запах"],
            correct: 0
          },
          {
            question: "Как правильно вызвать скорую помощь?",
            options: ["Сказать только «помогите»", "Назвать адрес, состояние пострадавшего, количество пострадавших", "Сказать «у меня проблема»", "Позвонить на 112 и повесить"],
            correct: 1
          },
          {
            question: "Какое средство из аптечки используется при отравлении?",
            options: ["Аспирин", "Активированный уголь", "Перекись водорода", "Йод"],
            correct: 1
          },
          {
            question: "Что нельзя делать при переломе?",
            options: ["Наложить шину", "Перемещать пострадавшего", "Удерживать конечность", "Приложить холод"],
            correct: 1
          },
          {
            question: "Какие признаки сердечного приступа?",
            options: ["Боль в груди, одышка, тошнота", "Кашель, насморк, температура", "Головокружение, потливость", "Судороги, рвота"],
            correct: 0
          },
          {
            question: "Какие действия при попадании инородного тела в дыхательные пути?",
            options: ["Потрясти", "Дать пить", "Выполнить приём Геймлиха", "Прижать к груди"],
            correct: 2
          },
          {
            question: "Какой срок хранения аптечки первой помощи на складе?",
            options: ["6 месяцев", "1 год", "2 года", "3 года"],
            correct: 2
          }
        ]
      },
      5: {
        title: "Погрузочно-разгрузочные работы и работа на высоте",
        questions: [
          {
            question: "Какой максимальный угол наклона лестницы допускается при работе на высоте?",
            options: ["45°", "60°", "75°", "90°"],
            correct: 1
          },
          {
            question: "Что необходимо использовать при работе на высоте более 1,8 м?",
            options: ["Каска", "Рукавицы", "Страховочный пояс", "Очки"],
            correct: 2
          },
          {
            question: "Какой способ погрузки груза считается наиболее безопасным?",
            options: ["Поднимать груз вручную с пола", "Использовать подъёмник или тележку", "Поднимать груз на плечи", "Поднимать груз двумя работниками без оборудования"],
            correct: 1
          },
          {
            question: "Какое минимальное расстояние должно быть между стеллажом и потолком при хранении грузов?",
            options: ["5 см", "15 см", "30 см", "50 см"],
            correct: 2
          },
          {
            question: "Какие действия запрещены при работе на высоте?",
            options: ["Использовать страховочный пояс", "Работать в шлеме", "Бросать инструменты вниз", "Работать при хорошей видимости"],
            correct: 2
          },
          {
            question: "Какой документ выдаётся работнику после прохождения инструктажа по работе на высоте?",
            options: ["Удостоверение о прохождении обучения", "Паспорт", "Справка о состоянии здоровья", "Карточка учета"],
            correct: 0
          },
          {
            question: "Как часто проводится проверка исправности ограждений и настилов?",
            options: ["Ежедневно", "Раз в неделю", "Раз в месяц", "Раз в квартал"],
            correct: 2
          },
          {
            question: "Какое максимальное количество человек может находиться на лестнице одновременно?",
            options: ["1", "2", "3", "4"],
            correct: 0
          },
          {
            question: "Как правильно поднимать тяжёлый груз с пола?",
            options: ["Согнуть спину и поднять", "Согнуть колени и держать спину прямо", "Поднять с помощью ног, не держа спину", "Поднять, подпрыгнув"],
            correct: 1
          },
          {
            question: "Что необходимо проверить перед использованием подъёмника?",
            options: ["Цвет кабины", "Наличие паспорта", "Исправность тормозов и фиксаторов", "Количество вентиляторов"],
            correct: 2
          }
        ]
      }
    };

  onMount(async () => {
    try {
      // Получаем параметры из URL
      const urlParams = new URLSearchParams(window.location.search);
      const idFromUrl = parseInt(urlParams.get('id'));

      // Используем testId из пропса, если он передан, иначе из URL
      testId = testId || idFromUrl || 1;
      testTitle = urlParams.get('title') || 'Тест';

      // Валидация testId
      if (!testsData[testId] || !testsData[testId].questions?.length) {
        alert('Тест не найден или не содержит вопросов.');
        isLoading = false;
        return;
      }

      test = testsData[testId];
      questions = test.questions;

      // Загрузка прогресса
      const savedProgress = loadProgress();
      if (savedProgress) {
        currentQuestionIndex = savedProgress.currentQuestionIndex;
        userAnswers = savedProgress.userAnswers;
        timeLeft = savedProgress.timeLeft;
      } else {
        userAnswers = new Array(questions.length).fill(null);
      }

      init();
    } catch (error) {
      console.error('Ошибка инициализации теста:', error);
      alert('Произошла ошибка при загрузке теста.');
    } finally {
      isLoading = false;
    }
  });

  function init() {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
      return;
    }
    timeLeft--;
  }

  $: formattedTime = (() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  })();

  $: timerClass = timeLeft <= 60 && timeLeft > 0 ? 'timer-warning' : '';

  function handleOptionClick(selectedIndex) {
    userAnswers[currentQuestionIndex] = selectedIndex;
    saveProgress(); // Сохраняем прогресс при выборе ответа
  }

  function goToPrevious() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      saveProgress();
    }
  }

  function goToNext() {
    // Проверка, выбран ли ответ
    if (userAnswers[currentQuestionIndex] === null) {
      highlightUnanswered();
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      saveProgress();
    } else {
      finishQuiz();
    }
  }

  function highlightUnanswered() {
    const container = document.getElementById('questionContainer');
    container.style.border = '2px solid #dc3545';
    setTimeout(() => {
      container.style.border = '';
    }, 1000);
  }

  async function finishQuiz() {
      // Устанавливаем индикатор обработки
      isProcessing = true;
      
      try {
        calculateResults();
        showResult = true;
        clearInterval(timerInterval);
        clearProgress();
        
        // Сохраняем результат прохождения теста
        saveTestCompletion(testId, percentage >= PASS_THRESHOLD);
      } finally {
        // Сбрасываем индикатор обработки
        isProcessing = false;
      }
    }

  function calculateResults() {
    score = userAnswers.reduce((acc, answer, index) => {
      if (answer === questions[index].correct) {
        return acc + 1;
      }
      return acc;
    }, 0);

    percentage = (score / questions.length) * 100;
    resultMessage = percentage >= PASS_THRESHOLD
      ? texts.passed
      : texts.failed;
  }

  function returnToTests() {
      window.location.href = '/testing';
  }

  // Сохранение прогресса в localStorage
  function saveProgress() {
    try {
      const progress = {
        currentQuestionIndex,
        userAnswers,
        timeLeft
      };
      localStorage.setItem(`progress_${testId}`, JSON.stringify(progress)); // Исправлено: добавлена закрывающая скобка
    } catch (e) {
      console.warn('Не удалось сохранить прогресс:', e);
    }
  }

  // Загрузка прогресса из localStorage
  function loadProgress() {
    try {
      const saved = localStorage.getItem(`progress_${testId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Не удалось загрузить прогресс:', e);
      return null;
    }
  }

  // Сброс состояния теста
  function resetQuiz() {
  currentQuestionIndex = 0;
  userAnswers = new Array(questions.length).fill(null);
  score = 0;
  percentage = 0;
  resultMessage = '';
  showResult = false;
  timeLeft = DEFAULT_TIME; // Сброс времени
  init(); // Перезапуск таймера
  clearProgress(); // Очистка прогресса из localStorage
}
  // Очистка прогресса из localStorage
  function clearProgress() {
    try {
      localStorage.removeItem(`progress_${testId}`);
    } catch (e) {
      console.warn('Не удалось очистить прогресс:', e);
    }
  }

  onDestroy(() => {
    clearInterval(timerInterval);
    clearProgress(); // Очистка прогресса при уничтожении компонента
  });
</script>


<div class="container">
  {#if isLoading}
    <div class="loading">Загрузка теста...</div>
  {:else if !showResult}
    <div class="header">
      <h1>{test?.title || 'Тест'}</h1>
      <Timer totalTime={timeLeft} className={timerClass} />
    </div>

    <div
      class="progress"
      aria-label="Прогресс: вопрос {currentQuestionIndex + 1} из {questions.length}"
    >
      {#if questions.length > 0}
        Вопрос {currentQuestionIndex + 1} из {questions.length}
        <div class="progress-bar">
          <div
            class="progress-fill"
            style="width: ${((currentQuestionIndex + 1) / questions.length) * 100}%"
          ></div>
        </div>
      {:else}
        <span class="error-message">Ошибка: вопросы не загружены</span>
      {/if}
    </div>

    <div id="questionContainer">
      <Question
        currentQuestionIndex={currentQuestionIndex}
        questions={questions}
        userAnswers={userAnswers}
        handleOptionClick={handleOptionClick}
      />
    </div>

    <div class="controls">
      <button
        class="btn-nav btn-prev"
        on:click={goToPrevious}
        disabled={currentQuestionIndex === 0}
        aria-label="{texts.back}"
      >
        {texts.back}
      </button>

      <button
        class="btn-nav btn-next"
        on:click={goToNext}
        aria-label="{currentQuestionIndex < questions.length - 1 ? texts.next : texts.finish}"
      >
        {currentQuestionIndex < questions.length - 1 ? texts.next : texts.finish}
      </button>
    </div>
  {:else}
      {#if isProcessing}
        <div class="loading-indicator">
          <p>Обработка результатов теста...</p>
        </div>
      {:else}
        <Results
          {score}
          {questions}
          {percentage}
          {resultMessage}
          {texts}
          testId={testId}
          onReturnToTests={returnToTests}
          onRetry={resetQuiz}
        />
      {/if}
  {/if}
  </div>


<style>
   * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .container {
      max-width: 800px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
      animation: fadeIn 0.8s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    h1 {
      color: #007BFF;
      text-align: center;
      margin-bottom: 40px;
      font-size: 28px;
      font-weight: 700; }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; } 
    }

    .progress {
      margin: 20px 0;
      text-align: center;
      font-size: 14px;
      color: #666; }

    .btn-nav {
      padding: 12px 24px;
      margin: 10px 5px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer; }

    .btn-prev {
      background: linear-gradient(135deg, #4088d4, #6794bb );
      color: white; }

    .btn-next {
      background: linear-gradient(135deg, #4088d4, #6794bb );
      color: white; }

    .btn-next:hover {
      background: linear-gradient(135deg, #0066cc, #004499);
      border-color: #007BFF; }

    .btn-nav:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #cccccc; }
          
        .loading-indicator {
          text-align: center;
          padding: 40px 20px;
        }
        
        .loading-indicator p {
          font-size: 18px;
          color: #007BFF;
          margin: 0;
        }

</style>