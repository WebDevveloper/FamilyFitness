// src/component/progress/ProgressPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { getJSON } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function ProgressPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // Получаем массив попыток из журнала
        const { progress } = await getJSON('/api/courses/progress');
        // Преобразуем в формат для Recharts
        const chartData = progress.map((item, idx) => ({
          // Показываем имя курса + дату старта попытки
          name: `${item.name} (${item.dateStarted})`,
          // Число реально пройденных дней (текущий день минус 1, если сегодня ещё не отмечен)
          completed: Math.min(item.currentDay, item.totalDays),
          // Всего дней в курсе
          total: item.totalDays
        }));
        setData(chartData);
      } catch (e) {
        if (e.statusCode === 401) {
          // незарегистрированный → редиректим на логин
          navigate('/login');
        } else {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Нет данных для отображения.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Статистика прогресса
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip
            formatter={(value, name) =>
              name === 'completed'
                ? [`${value} дней`, 'Пройдено']
                : [`${value} дней`, 'Всего']
            }
          />
          <Legend verticalAlign="top" />
          <Bar dataKey="completed" name="Пройдено" fill="#1976d2" />
          <Bar dataKey="total"     name="Всего дней" fill="#90caf9" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
