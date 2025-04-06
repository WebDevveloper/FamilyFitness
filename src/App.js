import CardioCourse from "./component/courses/cardio/CardioCourse";
import LoseWeightCourse from "./component/courses/lose_weight/LoseWeightCourse";
import MainCoursesPage from "./component/courses/main_page/MainCoursesPage";
import StrengthCourse from "./component/courses/strength/StrengthCourse";
import MainPage from "./component/main/MainPage";
import MainJournalPage from "./component/journal/MainJournalPage";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from "./component/universal/AppBar";
import About from "./component/about/About";
import SignUpForm from "./component/profile/SignUpForm";
import RegistrationForm from "./component/profile/RegistrationForm";
import DaySelectionPage from "./component/courses/days/DaySelectionPage";
import DayExercisesPage from "./component/courses/days/DayExercisesPage";
import LoseWeightDaySelectionPage from "./component/courses/days/LoseWeightDaySelectionPage";
import LoseWeightDayExercisesPage from "./component/courses/days/LoseWeightDayExercisesPage";
import CardioDaySelectionPage from "./component/courses/days/CardioDaySelectionPage";
import CardioDayExercisesPage from "./component/courses/days/CardioDayExercisesPage";
import ProfilePage from "./component/profile/ProfilePage";



function App() {
  return (
    <Router>
      <ResponsiveAppBar />
      <div className="body">
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<MainPage />} />
          
          {/* Страницы из меню */}
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<MainCoursesPage />} />
          <Route path="/journal" element={<MainJournalPage />} />

          {/* Курсы */}
          <Route path="/strength-training" element={<StrengthCourse />} />
          <Route path="/lose-weight-training" element={<LoseWeightCourse />} />
          <Route path="/cardio-training" element={<CardioCourse />} />

          {/* Упражнения */}
          {/* Страница выбора дня курса */}
          <Route path="/strength-training/days" element={<DaySelectionPage />} />
          {/* Страница упражнений выбранного дня (параметр day) */}
          <Route path="/strength-training/days/:day" element={<DayExercisesPage />} />

          <Route path="/lose-weight-training/days" element={<LoseWeightDaySelectionPage />} />
          <Route path="/lose-weight-training/days/:day" element={<LoseWeightDayExercisesPage />} />

          <Route path="/cardio-training/days" element={<CardioDaySelectionPage />} />
          <Route path="/cardio-training/days/:day" element={<CardioDayExercisesPage />} />

          {/* Профиль */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Форма регистрации/входа */}
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/registration" element={<RegistrationForm />} />

          {/* 404 */}
          <Route path="*" element={<h1>404: Page Not Found</h1>} />
        </Routes>
      </div>
  </Router>
  );
}

export default App;
