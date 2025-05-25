import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import ResponsiveAppBar from './component/universal/AppBar';
import MainPage from './component/main/MainPage';
import About from './component/about/About';

import MainCoursesPage from './component/courses/main_page/MainCoursesPage';
import StrengthCourse from './component/courses/strength/StrengthCourse';
import LoseWeightCourse from './component/courses/lose_weight/LoseWeightCourse';
import CardioCourse from './component/courses/cardio/CardioCourse';

import DaySelectionPage from './component/courses/days/DaySelectionPage';
import DayExercisesPage from './component/courses/days/DayExercisesPage';
import LoseWeightDaySelectionPage from './component/courses/days/LoseWeightDaySelectionPage';
import LoseWeightDayExercisesPage from './component/courses/days/LoseWeightDayExercisesPage';
import CardioDaySelectionPage from './component/courses/days/CardioDaySelectionPage';
import CardioDayExercisesPage from './component/courses/days/CardioDayExercisesPage';

import MainJournalPage from './component/journal/MainJournalPage';

import ProfilePage from './component/profile/ProfilePage';
import SignUpForm from './component/profile/SignUpForm';
import RegistrationForm from './component/profile/RegistrationForm';

import FamilyDashboard from './component/family/FamilyDashboard';
import CalendarPage from './component/calendar/CalendarPage';
import ProgressPage from './component/progress/ProgressPage';
import ChildProgressPage from './component/family/ChildProgressPage';

function App() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Router>
        <ResponsiveAppBar />

        <Routes>
          {/* Главная */}
          <Route path="/" element={<MainPage />} />

          {/* О проекте */}
          <Route path="/about" element={<About />} />

          {/* Семейный дашборд */}
          <Route path="/family" element={<FamilyDashboard />} />

          {/* Подробная информация о ребенке */}
          <Route path="/family/:childId" element={<ChildProgressPage  />}
/>

          {/* Программы */}
          <Route path="/programs" element={<MainCoursesPage />} />

          {/* Журнал */}
          <Route path="/journal" element={<MainJournalPage />} />

          {/* Календарь */}
          <Route path="/calendar" element={<CalendarPage />} />

          {/* Прогресс */}
          <Route path="/progress" element={<ProgressPage />} />

          {/* Курсы */}
          <Route path="/strength-training" element={<StrengthCourse />} />
          <Route path="/lose-weight-training" element={<LoseWeightCourse />} />
          <Route path="/cardio-training" element={<CardioCourse />} />

          {/* Выбор дня для каждого курса */}
          
          {/* Сила */}
          <Route path="/strength-training/days" element={<DaySelectionPage purposeId={1}/>} />
          <Route path="/strength-training/days/:day" element={<DayExercisesPage purposeId={1}/>} />

          {/* Похудение */}
          {/* <Route path="/lose-weight-training/days" element={<DaySelectionPage purposeId={2}/>} />
          <Route path="/lose-weight-training/days/:day" element={<DayExercisesPage purposeId={2}/>} /> */}

          {/* Кардио */}
          {/* <Route path="/cardio-training/days" element={<DaySelectionPage purposeId={3}/>} />
          <Route path="/cardio-training/days/:day" element={<DayExercisesPage purposeId={3}/>} /> */}

          <Route path="/lose-weight-training/days" element={<LoseWeightDaySelectionPage />} />
          <Route path="/lose-weight-training/days/:day" element={<LoseWeightDayExercisesPage />} />

          <Route path="/cardio-training/days" element={<CardioDaySelectionPage />} />
          <Route path="/cardio-training/days/:day" element={<CardioDayExercisesPage />} />

          {/* Профиль */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Аутентификация */}
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/registration" element={<RegistrationForm />} />

          {/* 404 */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;