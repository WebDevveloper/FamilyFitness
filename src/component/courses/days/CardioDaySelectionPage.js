import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../../api';

export default function CardioDaySelectionPage() {
  const navigate = useNavigate();
  const totalDays = 30;
  const courseId = 3;
  const [currentDay, setCurrentDay] = useState(1);
  const [isOver, setIsOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProgress() {
      try {
        const data = await getJSON('/api/courses/progress');
        const rec = data.progress.find(r => r.purposeId === courseId);
        if (!rec) throw new Error('Прогресс не найден');
        setCurrentDay(rec.currentDay);
        setIsOver(Boolean(rec.isOver));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  const handleDaySelect = (day) => {
    if (!isOver && day <= currentDay) {
      navigate(`/cardio-training/days/${day}`);
    }
  };

  const handleResetCourse = async () => {
    try {
      await postJSON(`/api/courses/reset`, { purposeId: courseId });
      // после сброса просто перезагружаем прогресс
      setLoading(true);
      setError('');
      // повторный fetchProgress()
      const data = await getJSON('/api/courses/progress');
      const rec = data.progress.find(r => r.purposeId === courseId);
      setCurrentDay(rec.currentDay);
      setIsOver(Boolean(rec.isOver));
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>Выберите день курса</Typography>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, 80px)', justifyContent: 'center' }}>
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const disabled = isOver || day > currentDay;
          let color = 'inherit';
          if (day < currentDay) color = 'success';
          else if (day === currentDay) color = 'primary';
          return (
            <Button
              key={day}
              variant="contained"
              color={color}
              disabled={disabled}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </Button>
          );
        })}
      </Box>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button onClick={handleResetCourse}>Начать сначала</Button>
      </Box>
    </Paper>
  );
}