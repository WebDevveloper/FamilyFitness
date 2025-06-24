import { getJSON, postJSON, putJSON, deleteJSON } from '../api';

/** COURSES */

// получить список всех курсов (для админа)
export function fetchCourses() {
  return getJSON('/api/admin/courses');
}

// создать новый курс
export function createCourse(data) {
  return postJSON('/api/admin/courses', data);
}

// обновить курс по ID
export function updateCourse(id, data) {
  return putJSON(`/api/admin/courses/${id}`, data);
}

// удалить курс по ID
export function deleteCourse(id) {
  return deleteJSON(`/api/admin/courses/${id}`);
}

// скрыть / опубликовать курс
export function togglePublishCourse(id, publish) {
  return putJSON(`/api/admin/courses/${id}/publish`, { publish });
}

/** EXERCISES (для админа) */

// получить все упражнения в системе
export function fetchAllExercises() {
  return getJSON('/api/exercises');
}

// получить упражнения, привязанные к конкретному курсу
export function fetchCourseExercises(courseId) {
  return getJSON(`/api/admin/courses/${courseId}/exercises`);
}

// добавить упражнение к курсу
// вторым параметром передаем объект { exerciseId, day }
export function addExerciseToCourse(courseId, { exerciseId, day }) {
  return postJSON(`/api/admin/courses/${courseId}/exercises`, {
    exerciseId,
    day
  });
}

// удалить упражнение из курса по configId
export function removeExerciseFromCourse(courseId, configId) {
  return deleteJSON(
    `/api/admin/courses/${courseId}/exercises/${configId}`
  );
}
