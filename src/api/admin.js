import { getJSON, postJSON, putJSON, deleteJSON } from '../api';

/** COURSES */
export function fetchCourses() {
  // GET /api/admin/courses → { courses }
  return getJSON('/api/admin/courses');
}
export function createCourse(data) {
  // POST /api/admin/courses
  return postJSON('/api/admin/courses', data);
}
export function updateCourse(id, data) {
  // PUT /api/admin/courses/:id
  return putJSON(`/api/admin/courses/${id}`, data);
}
export function deleteCourse(id) {
  // DELETE /api/admin/courses/:id
  return deleteJSON(`/api/admin/courses/${id}`);
}

/** EXERCISES (для админа) */
// list all exercises in the system
export function fetchAllExercises() {
  // GET /api/exercises → { exercises }
  return getJSON('/api/exercises');
}
// list exercises already assigned to a specific course
export function fetchCourseExercises(courseId) {
  // GET /api/admin/courses/:id/exercises → { exercises }
  return getJSON(`/api/admin/courses/${courseId}/exercises`);
}
// add one exercise (with day) to a course
export function addExerciseToCourse(courseId, exerciseId, day = 1) {
  // POST /api/admin/courses/:id/exercises  { exerciseId, day }
  return postJSON(`/api/admin/courses/${courseId}/exercises`, {
    exerciseId,
    day
  });
}
// remove by purpose_config.id
export function removeExerciseFromCourse(courseId, configId) {
  // DELETE /api/admin/courses/:id/exercises/:configId
  return deleteJSON(
    `/api/admin/courses/${courseId}/exercises/${configId}`
  );
}