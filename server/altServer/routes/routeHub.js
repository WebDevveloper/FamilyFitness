const express = require('express');
const { registration, login, getUsers } = require('../registration/regLogin');

const { strengthCourse } = require('../courses/strength/strengthCourse');
const { loseWeigthCourse } = require('../courses/lose-weigth/loseWeigthCourse');
const { cardioCourse } = require('../courses/cardio/cardioCourse');

const { courseList } = require('../courses/listOfCourses/courseList');
const { succesDays } = require('../courses/listOfCourses/successDays');

// Новые эндпоинты
const { getExercises } = require('../courses/exercises/getExercises');
const { completeDay } = require('../courses/exercises/completeDay');

// Эндпоинты для сброса курса
const { resetCourse } = require('../courses/reset/courseReset');
const { editProfile } = require('../profile/profileEdit')

// Профиль 
const { getProfile } = require('../profile/profile');

const router = express.Router();

// Маршруты аутентификации
router.post('/registration', registration);
router.post('/login', login);
router.get('/users', getUsers);

// Маршруты курсов
router.post('/strength-course', strengthCourse);
router.post('/lose-weigth-course', loseWeigthCourse);
router.post('/cardio-course', cardioCourse);

// Маршруты для журнала
// router.get('/courses', courseList);
// router.get('/courses', courses);
router.get('/journal/:courseId', succesDays);

// Новые маршруты для выбранного дня
router.get('/exercises/:courseId/:day', getExercises);
router.post('/journal/:courseId/:day/complete', completeDay);

// Маршрут для профиля
router.get('/profile', getProfile);
router.put('/profile/edit', editProfile);
router.post('/journal/:courseId/reset', resetCourse);

module.exports = router;