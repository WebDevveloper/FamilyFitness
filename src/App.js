import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import ResponsiveAppBar from './component/universal/AppBar';

// Public & Auth
import MainPage       from './component/main/MainPage';
import About          from './component/about/About';
import SignUpForm     from './component/profile/SignUpForm';
import RegistrationForm from './component/profile/RegistrationForm';
import ProfilePage    from './component/profile/ProfilePage';

// Courses
import MainCoursesPage   from './component/courses/main_page/MainCoursesPage';
import StrengthCourse    from './component/courses/strength/StrengthCourse';
import LoseWeightCourse  from './component/courses/lose_weight/LoseWeightCourse';
import CardioCourse      from './component/courses/cardio/CardioCourse';
import DaySelectionPage  from './component/courses/days/DaySelectionPage';
import DayExercisesPage  from './component/courses/days/DayExercisesPage';

// Family / Journal / Calendar / Progress
import FamilyDashboard   from './component/family/FamilyDashboard';
import ChildProgressPage from './component/family/ChildProgressPage';
import MainJournalPage   from './component/journal/MainJournalPage';
import CalendarPage      from './component/calendar/CalendarPage';
import ProgressPage      from './component/progress/ProgressPage';

// Admin
import AdminRoute      from './component/admin/AdminRoute';
import AdminLayout     from './component/admin/AdminLayout';
import CourseListPage  from './component/admin/CourseListPage';
import CourseEditPage  from './component/admin/CourseEditPage';
import UserListPage    from './component/admin/UserListPage'; // будет скоро
import UltimateDaySelectionPage from './component/courses/days/UltimateDaySelectionPage';

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />

          {/* Auth */}
          <Route path="/signup"       element={<SignUpForm />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/profile"      element={<ProfilePage />} />

          {/* Courses */}
          <Route path="/programs"                 element={<MainCoursesPage />} />
          <Route path="/strength-training"        element={<StrengthCourse />} />
          <Route path="/strength-training/days"   element={<UltimateDaySelectionPage purposeId={1} />} />
          <Route path="/strength-training/days/:day" element={<DayExercisesPage purposeId={1} />} />

          <Route path="/lose-weight-training"        element={<LoseWeightCourse />} />
          <Route path="/lose-weight-training/days"   element={<UltimateDaySelectionPage purposeId={2} />} />
          <Route path="/lose-weight-training/days/:day" element={<DayExercisesPage purposeId={2} />} />

          <Route path="/cardio-training"        element={<CardioCourse />} />
          <Route path="/cardio-training/days"   element={<UltimateDaySelectionPage purposeId={3} />} />
          <Route path="/cardio-training/days/:day" element={<DayExercisesPage purposeId={3} />} />

          {/* Family / Journal / Calendar / Progress */}
          <Route path="/family"          element={<FamilyDashboard />} />
          <Route path="/family/:childId" element={<ChildProgressPage />} />
          <Route path="/journal"         element={<MainJournalPage />} />
          <Route path="/calendar"        element={<CalendarPage />} />
          <Route path="/progress"        element={<ProgressPage />} />

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="courses"            element={<CourseListPage />} />
              <Route path="courses/:id/edit"   element={<CourseEditPage />} />
              <Route path="users"              element={<UserListPage />} />
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
