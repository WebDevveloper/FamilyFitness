// src/components/strength/StrengthDaySelectionPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../../api';

export default function StrengthDaySelectionPage() {
  const navigate = useNavigate();
  const totalDays = 30;
  const purposeId = 1;
  const [currentDay, setCurrentDay] = useState(1);
  const [isOver, setIsOver] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { progress } = await getJSON('/api/courses/progress');
        const rec = progress.find(r => r.purposeId === purposeId);
        if (!rec) throw new Error('Прогресс не найден');
        setCurrentDay(rec.currentDay);
        setIsOver(Boolean(rec.isOver));
        setJournalId(rec.journalId);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDaySelect = (day) => {
    if (day <= currentDay) {
      navigate(`/strength-training/days/${day}`, { state: { journalId } });
    }
  };

  const handleReset = async () => {
    try {
      await postJSON('/api/courses/start', { purposeId });
      // перезагрузить прогресс
      setLoading(true);
      const { progress } = await getJSON('/api/courses/progress');
      const rec = progress.find(r => r.purposeId === purposeId);
      setCurrentDay(rec.currentDay);
      setIsOver(Boolean(rec.isOver));
      setJournalId(rec.journalId);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error)   return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p:3, mt:2 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Выберите день силового курса (текущий: {currentDay})
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(auto-fill, 80px)',
          justifyContent: 'center'
        }}
      >
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const disabled = day > currentDay;
          let color = day < currentDay ? 'success' : (day === currentDay ? 'primary' : 'inherit');
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

      <Box textAlign="center" sx={{ mt:2 }}>
        <Button onClick={handleReset}>Начать сначала</Button>
      </Box>
    </Paper>
  );
}
