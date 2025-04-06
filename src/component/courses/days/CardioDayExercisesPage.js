import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';

export default function CardioDayExercisesPage() {
  const { day } = useParams(); // номер дня из URL
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Массив-счетчик для каждого упражнения (0/5)
  const [counters, setCounters] = useState([]);

  // Получаем упражнения выбранного дня
  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setSnackbarMessage('Пользователь не авторизован.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      // Для силового курса предполагаем courseId = 1
      const response = await fetch(`http://localhost:5000/api/exercises/3/${day}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка получения упражнений.');
      }
      const data = await response.json();
      setExercises(data.exercises);
      // Инициализируем счетчики для каждого упражнения (0 из 5)
      setCounters(new Array(data.exercises.length).fill(0));
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  // Функция для завершения дня курса
  const completeDay = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setSnackbarMessage('Пользователь не авторизован.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      const response = await fetch(`http://localhost:5000/api/journal/3/${day}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка завершения дня.');
      }
      const data = await response.json();
      setSnackbarMessage(data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // Переход обратно на страницу выбора дня после успешного завершения
      setTimeout(() => {
        navigate('/cardio-training/days');
      }, 2000);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Функция для увеличения счётчика подходов для конкретного упражнения
  const incrementCounter = (index) => {
    setCounters((prevCounters) => {
      const newCounters = [...prevCounters];
      if (newCounters[index] < 5) {
        newCounters[index] += 1;
      }
      return newCounters;
    });
  };

  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Упражнения на День {day}
      </Typography>
      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {exercises.length === 0 ? (
            <Typography variant="body1">Упражнения не найдены.</Typography>
          ) : (
            exercises.map((exercise, index) => (
              <Grid item xs={12} key={exercise.id}>
                <Paper
                  elevation={4}
                  sx={{
                    padding: 2,
                    minHeight: 150, // увеличенная высота карточки
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {exercise.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Описание:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {exercise.about}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Как выполнять:
                    </Typography>
                    <Typography variant="body1">
                      {exercise.how_to_do}
                    </Typography> 
                  </Box>
                  <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      onClick={() => incrementCounter(index)}
                      disabled={counters[index] >= 5}
                    >
                      Подходы: {counters[index]}/5
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
        <Button variant="contained" onClick={completeDay}>
          Завершить день
        </Button>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
