import React from 'react';
import { Paper, Typography, Grid, CardMedia } from '@mui/material';
import cardioImg from '../../main/img/cardio.jpg';
import CourseStartButton from '../CourseStartButton';

export default function CardioCourse() {
  return (
    <Paper sx={{ p:2, mb:2 }}>
      <Typography variant="h5" align="center" gutterBottom>Кардио</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CardMedia component="img" image={cardioImg} alt="cardio" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography>Укрепление сердца и выносливости.</Typography>
          <CourseStartButton purposeId={3} redirect="/cardio-training/days" />
        </Grid>
      </Grid>
    </Paper>
  );
}