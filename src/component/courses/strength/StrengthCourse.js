// StrengthCourse.js
import React, { useState } from 'react';
import { Grid, Typography, CardMedia, Paper, Button, Snackbar, Alert } from '@mui/material';
import strengthCourseImage from '../../main/img/strength-course.jpg';
import { useNavigate } from 'react-router-dom';
import CoursesButton from '../../universal/CoursesButton';

export default function StrengthCourse() {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error

  const handleCourseSelect = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setSnackbarMessage('Вы должны войти в систему для выбора курса.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const response = await fetch('http://localhost:5000/api/strength-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Передача токена
        },
        body: JSON.stringify({ purposeId: 1 }), // ID курса для силовой тренировки
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка выбора курса.');
      }

      const data = await response.json();
      setSnackbarMessage('Курс успешно выбран!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      console.log('Ответ сервера:', data); // Для отладки
      
      // После успешного выбора курса переходим на страницу выбора дня
      navigate('/strength-training/days');
    } catch (error) {
      console.error('Ошибка выбора курса:', error.message);
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <CoursesButton  />
      <Paper elevation={3} sx={{ padding: 2, height: 'auto'}}>
        <Typography variant="h5" component="div" textAlign={'center'}>
          Силовая тренировка
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <CardMedia
              component="img"
              image={strengthCourseImage}
              alt="Силовая тренировка"
              sx={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Силовая тренировка представляет собой высокоинтенсивную нагрузку 
              на мышцы с целью увеличения физической силы.
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Button variant="contained" onClick={handleCourseSelect}>
              Приступить
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}