import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { getJSON } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser]       = useState(null);
  const [prog, setProg]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // 1) Получаем профиль
        const u = await getJSON('/api/profile/me');
        setUser(u);

        // 2) Получаем прогресс
        const { progress } = await getJSON('/api/courses/progress');
        setProg(progress);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Пока идёт загрузка
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Если произошла ошибка или user не пришёл
  if (error || !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || 'Не удалось загрузить профиль'}
        </Alert>
      </Box>
    );
  }

  // Фильтрация курсов
  const active   = prog.filter(c => c.isOver === 0);
  const complete = prog.filter(c => c.isOver === 1);

  return (
    <Box sx={{ p: 2 }}>
      {/* Профиль */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body2">ID: {user.id}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Активные курсы */}
      <Typography variant="h6" gutterBottom>Активные курсы</Typography>
      {active.length === 0 && (
        <Typography color="text.secondary">Нет активных курсов</Typography>
      )}
      {active.map(c => (
        <Paper key={c.journalId} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1"><b>{c.name}</b></Typography>
          <Typography variant="body2">Начало: {c.dateStarted}</Typography>
          <Typography variant="body2">
            День {c.currentDay} из {c.totalDays}
          </Typography>
          <Box mt={1}>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const name = c.name.toLowerCase();
                if (name.includes('сила')) {
                  nav('/strength-training/days');
                } else if (name.includes('похудение')) {
                  nav('/lose-weight-training/days');
                } else {
                  nav('/cardio-training/days');
                }
              }}
            >
              Продолжить
            </Button>
          </Box>
        </Paper>
      ))}

      {/* Завершённые курсы */}
      <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Завершённые курсы</Typography>
      {complete.length === 0 && (
        <Typography color="text.secondary">Нет завершённых курсов</Typography>
      )}
      {complete.map(c => (
        <Paper key={c.journalId} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1"><b>{c.name}</b></Typography>
          <Typography variant="body2">Начало: {c.dateStarted}</Typography>
          <Typography variant="body2">Конец: {c.dateEnded}</Typography>
          <Typography variant="body2">
            Сожжено калорий: {Math.round(c.burnedCalories || 0)}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
