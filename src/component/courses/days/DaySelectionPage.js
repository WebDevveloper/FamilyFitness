// DaySelectionPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DaySelectionPage() {
  const navigate = useNavigate();
  const totalDays = 30;
  const courseId = 1;
  const [currentDay, setCurrentDay] = useState(1);
  const [isOver, setIsOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Функция для получения прогресса курса из журнала
  const fetchJournalProgress = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Пользователь не авторизован.');
        setLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:5000/api/journal/${courseId}?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка получения прогресса.');
      }
      const data = await response.json();
      const journal = Array.isArray(data.journal) ? data.journal[0] : data.journal;
      console.log('Полученный журнал:', journal);
      setCurrentDay(parseInt(journal.current_day, 10));
      // Явное преобразование флага:
      setIsOver(Number(journal.is_over) === 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchJournalProgress();
  }, []);

  // Вспомогательная переменная: если курс завершён, считаем currentDayEffective равным totalDays + 1,
  // чтобы все дни (1..30) удовлетворяли условию day < currentDayEffective
  const currentDayEffective = isOver ? totalDays + 1 : currentDay;

  // Функция перехода на страницу упражнений для выбранного дня (только если курс не завершён)
  const handleDaySelect = (day) => {
    if (!isOver && day <= currentDayEffective) {
      navigate(`/strength-training/days/${day}`);
    }
  };

  // Функция сброса курса (перезапуска)
  const handleResetCourse = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Пользователь не авторизован.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/journal/${courseId}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка сброса курса.');
      }
      // После успешного сброса обновляем прогресс
      await fetchJournalProgress();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Выберите день курса
      </Typography>
      {loading ? (
        <Typography textAlign="center">Загрузка прогресса...</Typography>
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : (
        <Box
          sx={{
            mx: 'auto',
            width: '100%',
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' }
          }}
        >
          {Array.from({ length: totalDays }, (_, index) => {
            const day = index + 1;
            let buttonColor;
            if (day < currentDayEffective) {
              buttonColor = 'success';
            } else if (day === currentDayEffective) {
              buttonColor = !isOver ? 'primary' : 'success';
            } else {
              buttonColor = 'inherit';
            }
            // Если курс завершён, все кнопки должны быть недоступны
            const disabled = !isOver ? day > currentDayEffective : true;
            return (
              <Button
                key={day}
                variant="contained"
                color={buttonColor}
                onClick={() => handleDaySelect(day)}
                disabled={disabled}
                sx={{
                  width: '100%',
                  height: 80,
                  fontSize: '1.2rem'
                }}
              >
                {day}
              </Button>
            );
          })}
        </Box>
      )}
      {/* Показываем кнопку сброса только если курс завершён */}
      {/* {isOver && ( */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={handleResetCourse}>
            Начать сначала
          </Button>
        </Box>
    </Paper>
  );
}