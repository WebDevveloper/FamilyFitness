import React from 'react'
import ResponsiveAppBar from '../../universal/AppBar'
import { Grid, Typography, CardMedia, Paper, Button } from '@mui/material';
import './styles/MainCoursesPageStyles.css';
import CourseCard from '../../main/CourseCard';
import { useNavigate } from 'react-router-dom';
import Footer from '../../universal/Footer';

export default function MainCoursesPage() {
  return (
    <div className='main'>
        <div className='header'>
           
        </div>
        <div className='body'>
            <CourseCard/>
           
        </div>
    </div>
  )
}
