import React from 'react'

import CourseCard from "./CourseCard";
import PriceCard from "./PriceCard";
import WhyWe from "./WhyWhe";
import Footer from "../universal/Footer";
import "./styles/main-page.css";

import firstBlackImage from './img/first-black.jpg'; // Импорт изображения

export default function MainPage() {
  return (
    // <Router>
      <div className="main">
        <div className="header">
          {/* <ResponsiveAppBar /> */}
        </div>
        <div className="body">
          <div id="main-img">
              <img alt="gym people" src={firstBlackImage} />
          </div>
            <CourseCard />
            <WhyWe />
            <PriceCard />
            <Footer />
        </div>
      </div>
   
  );
}
