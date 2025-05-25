import React, { useState } from 'react';
import { Grid, Typography, CardMedia, Paper, Button, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { postJSON } from '../../../api';
import cardioCourseImage from '../../main/img/cardio.jpg';
import CoursesButton from '../../universal/CoursesButton';

export default function CardioCourse() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCourseSelect = async () => {
    try {
      await postJSON('/api/courses/start', { purposeId: 3 });
      setSnackbar({ open: true, message: 'Курс успешно выбран!', severity: 'success' });
      navigate('/cardio-training/days');
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
  };

  return (
    <>
      <CoursesButton  />
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" textAlign="center">Кардио</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CardMedia component="img" image={cardioCourseImage} alt="cardio" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>Кардио-тренировки укрепляют сердце и выносливость.</Typography>
          </Grid>
        </Grid>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleCourseSelect}>
          Приступить
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}