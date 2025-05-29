import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import ResponsiveAppBar  from './component/universal/AppBar';

import MainPage          from './component/main/MainPage';
import About             from './component/about/About';

import MainCoursesPage   from './component/courses/main_page/MainCoursesPage';
import StrengthCourse    from './component/courses/strength/StrengthCourse';
import LoseWeightCourse  from './component/courses/lose_weight/LoseWeightCourse';
import CardioCourse      from './component/courses/cardio/CardioCourse';

import DaySelectionPage  from './component/courses/days/DaySelectionPage';
import DayExercisesPage  from './component/courses/days/DayExercisesPage';
import LoseWeightDaySelection from './component/courses/days/LoseWeightDaySelectionPage';
import LoseWeightDayExercises from './component/courses/days/LoseWeightDayExercisesPage';
import CardioDaySelection     from './component/courses/days/CardioDaySelectionPage';
import CardioDayExercises     from './component/courses/days/CardioDayExercisesPage';

import MainJournalPage  from './component/journal/MainJournalPage';

import ProfilePage      from './component/profile/ProfilePage';
import SignUpForm       from './component/profile/SignUpForm';
import RegistrationForm from './component/profile/RegistrationForm';

import FamilyDashboard      from './component/family/FamilyDashboard';
import ChildProgressPage    from './component/family/ChildProgressPage';

import CalendarPage     from './component/calendar/CalendarPage';
import ProgressPage     from './component/progress/ProgressPage';

// админка
import AdminRoute        from './component/admin/AdminRoute';
import AdminLayout       from './component/admin/AdminLayout';
import CourseListPage    from './component/admin/CourseListPage';
import CourseEditPage from './component/admin/CourseEditPage';

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />

          {/* Auth */}
          <Route path="/signup"       element={<SignUpForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/profile"      element={<ProfilePage />} />

          {/* Family / Child */}
          <Route path="/family"       element={<FamilyDashboard />} />
          <Route path="/family/:childId" element={<ChildProgressPage />} />

          {/* Journal / Calendar / Progress */}
          <Route path="/journal"      element={<MainJournalPage />} />
          <Route path="/calendar"     element={<CalendarPage />} />
          <Route path="/progress"     element={<ProgressPage />} />

          {/* Courses */}
          <Route path="/programs"          element={<MainCoursesPage />} />
          <Route path="/strength-training" element={<StrengthCourse />} />
          <Route path="/strength-training/days" element={<DaySelectionPage purposeId={1} />} />
          <Route path="/strength-training/days/:day" element={<DayExercisesPage purposeId={1} />} />

          <Route path="/lose-weight-training" element={<LoseWeightCourse />} />
          <Route path="/lose-weight-training/days" element={<LoseWeightDaySelection />} />
          <Route path="/lose-weight-training/days/:day" element={<LoseWeightDayExercises />} />

          <Route path="/cardio-training" element={<CardioCourse />} />
          <Route path="/cardio-training/days" element={<CardioDaySelection />} />
          <Route path="/cardio-training/days/:day" element={<CardioDayExercises />} />

          {/* Admin секция */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="courses" element={<CourseListPage />} />
              <Route path="courses/:id/edit" element={<CourseEditPage />} />
              {/* ...другие админ-маршруты */}
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
