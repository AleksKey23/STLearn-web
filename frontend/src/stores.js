import { writable } from 'svelte/store';

// Хранилище пользователей
export const usersStore = writable([
  {
    id: 2,
    name: 'Администратор',
    role: 'admin',
    progress: 100,
    registrationDate: new Date().toLocaleDateString('ru-RU')
  }
]);

// Хранилище активности
export const activityStore = writable([]);

// Хранилище лекций
const initialLectures = [
  {
    id: 1,
    title: "Средства индивидуальной защиты",
    description: "Изучите виды СИЗ, правила их применения, сроки службы и нормы выдачи. Узнайте, как правильно надевать и снимать защитные костюмы, очки, респираторы и перчатки.",
    completed: false
  },
  {
    id: 2,
    title: "Безопасная эксплуатация складского оборудования",
    description: "Правила работы с погрузчиками, штабелёрами, тележками и конвейерами. Инструктаж по технике безопасности, проверке технического состояния и действиям при аварии.",
    completed: false
  },
  {
    id: 3,
    title: "Пожарная безопасность на складе",
    description: "Причины возгораний на складах, классы пожаров, типы огнетушителей, правила хранения горючих материалов, эвакуация и действия при пожаре.",
    completed: false
  },
  {
    id: 4,
    title: "Основы оказания первой медицинской помощи",
    description: "Алгоритмы оказания первой помощи при травмах, ожогах, обмороках, кровотечениях и остановке дыхания. Правила использования аптечки и вызова скорой помощи.",
    completed: false
  },
  {
    id: 5,
    title: "Погрузочно-разгрузочные работы и работа на высоте",
    description: "Безопасные методы погрузки/разгрузки, использование подъёмников, лестниц и настилов. Работа на высоте более 1,8 м: страховка, ограждения, допуск и инструктаж.",
    completed: false
  }
];

export const lecturesStore = writable(initialLectures);

// Функция для обновения статуса лекции (локально)
export function updateLectureStatusLocal(lectureId, completed) {
  lecturesStore.update(lectures => {
    const updatedLectures = lectures.map(lecture => {
      if (lecture.id === lectureId) {
        return { ...lecture, completed };
      }
      return lecture;
    });

    // Сохраняем в localStorage с обработкой ошибок
    try {
      localStorage.setItem(`lecture_${lectureId}`, completed.toString());
    } catch (error) {
      console.warn(`Не удалось сохранить статус лекции ${lectureId}:`, error);
    }
    
    return updatedLectures;
  });
}

// Загрузка статусов из localStorage с обработкой ошибок
export function loadLecturesFromLocalStorage() {
  lecturesStore.update(lectures =>
    lectures.map(lecture => {
      try {
        const saved = localStorage.getItem(`lecture_${lecture.id}`);
        if (saved !== null) {
          return { ...lecture, completed: saved === 'true' };
        }
      } catch (error) {
        console.warn(`Не удалось загрузить статус лекции ${lecture.id}:`, error);
      }
      return lecture;
    })
  );
}

// Хранилище тестов
const initialTests = [
  { id: 1, title: "Средства индивидуальной защиты", completed: false },
  { id: 2, title: "Безопасная эксплуатация складского оборудования", completed: false },
  { id: 3, title: "Пожарная безопасность на складе", completed: false },
  { id: 4, title: "Основы оказания первой медицинской помощи", completed: false },
  { id: 5, title: "Погрузочно-разгрузочные работы и работа на высоте", completed: false }
];

export const testsStore = writable(initialTests);

// Функция для обновления статуса теста
export function updateTestStatusLocal(testId, completed) {
  testsStore.update(tests => {
    const updatedTests = tests.map(test => {
      if (test.id === testId) {
        return { ...test, completed };
      }
      return test;
    });

    // Сохраняем в localStorage с обработкой ошибок
    try {
      localStorage.setItem(`test_${testId}`, completed.toString());
    } catch (error) {
      console.warn(`Не удалось сохранить статус теста ${testId}:`, error);
    }
    
    return updatedTests;
  });
}

// Загрузка статусов тестов из localStorage с обработкой ошибок
export function loadTestsFromLocalStorage() {
  testsStore.update(tests =>
    tests.map(test => {
      try {
        const saved = localStorage.getItem(`test_${test.id}`);
        if (saved !== null) {
          return { ...test, completed: saved === 'true' };
        }
      } catch (error) {
        console.warn(`Не удалось загрузить статус теста ${test.id}:`, error);
      }
      return test;
    })
  );
}

// Функция для добавления нового пользователя с обработкой ошибок
export function addUser(userData) {
  usersStore.update(users => {
    const newUser = {
      id: users.length + 1,
      name: userData.name,
      role: userData.role,
      progress: 0,
      registrationDate: new Date().toLocaleDateString('ru-RU')
    };
    
    const updatedUsers = [...users, newUser];
    
    // Сохраняем в localStorage с обработкой ошибок
    try {
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.warn('Не удалось сохранить список пользователей:', error);
    }
    
    return updatedUsers;
  });
}

// Функция для редактирования пользователя с обработкой ошибок
export function editUser(userId, newData) {
  usersStore.update(users => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, ...newData };
      }
      return user;
    });
    
    // Сохраняем в localStorage с обработкой ошибок
    try {
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.warn('Не удалось сохранить список пользователей:', error);
    }
    
    return updatedUsers;
  });
}

// Функция для удаления пользователя с обработкой ошибок
export function deleteUser(userId) {
  usersStore.update(users => {
    const updatedUsers = users.filter(user => user.id !== userId);
    
    // Сохраняем в localStorage с обработкой ошибок
    try {
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.warn('Не удалось сохранить список пользователей:', error);
    }
    
    return updatedUsers;
  });
}

// Функция для добавления активности с обработкой ошибок
export function addActivity(activityData) {
  activityStore.update(activities => {
    const newActivity = {
      id: activities.length + 1,
      user: activityData.user || 'Пользователь',
      action: activityData.action,
      timestamp: new Date().toLocaleTimeString('ru-RU'),
      date: new Date().toLocaleDateString('ru-RU'),
      success: activityData.success || false
    };
    
    const updatedActivities = [...activities, newActivity];
    
    // Сохраняем в localStorage с обработкой ошибок
    try {
      localStorage.setItem('activity', JSON.stringify(updatedActivities));
    } catch (error) {
      console.warn('Не удалось сохранить список активности:', error);
    }
    
    return updatedActivities;
  });
}

// Загрузка активности из localStorage
export function loadActivityFromLocalStorage() {
  try {
    const activityStr = localStorage.getItem('activity');
    if (activityStr) {
      const loadedActivity = JSON.parse(activityStr);
      if (Array.isArray(loadedActivity)) {
        activityStore.set(loadedActivity);
      }
    }
  } catch (e) {
    console.error('Ошибка парсинга активности:', e);
  }
}

// Сохранение активности в localStorage
export function saveActivityToLocalStorage() {
  activityStore.subscribe(activities => {
    localStorage.setItem('activity', JSON.stringify(activities));
  });
}
