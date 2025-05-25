import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { getJSON, postJSON } from '../../../api';
import { useNavigate } from 'react-router-dom';

export default function CardioDaySelectionPage() {
  const navigate = useNavigate();
  const totalDays = 30;
  const purposeId = 3;
  const [currentDay, setCurrentDay] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Забираем прогресс и ID активной попытки
  useEffect(() => {
    (async () => {
      const { progress } = await getJSON('/api/courses/progress');
      const rec = progress.find(r => r.purposeId === purposeId);
      if (rec) {
        setCurrentDay(rec.currentDay);
        setIsOver(rec.isOver === 1);
        setJournalId(rec.journalId);
      }
      setLoading(false);
    })();
  }, []);

  // выбор дня
  const handleDay = day => {
    if (day <= currentDay) {
      navigate(`/cardio-training/days/${day}`, { state: { journalId } });
    }
  };

  // кнопка «Начать сначала» доступна только если курс полностью пройден
  const handleReset = async () => {
    if (!isOver) return;
    await postJSON('/api/courses/reset', { purposeId });
    window.location.reload();
  };

  if (loading) return <Typography>Загрузка...</Typography>;

  return (
    <Paper sx={{ p:3, mt:2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Выберите день курса
      </Typography>
      <Box
        sx={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill,80px)',
          gap:2,
          justifyContent:'center',
        }}
      >
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const disabled = day > currentDay;  // все дни > currentDay недоступны
          let color = 'inherit';
          if (day < currentDay) color = 'success';
          if (day === currentDay) color = 'primary';
          return (
            <Button
              key={day}
              variant="contained"
              color={color}
              disabled={disabled}
              onClick={() => handleDay(day)}
            >
              {day}
            </Button>
          );
        })}
      </Box>
      <Box textAlign="center" sx={{ mt:2 }}>
        <Button
          variant="outlined"
          color="error"
          disabled={!isOver}
          onClick={handleReset}
        >
          Начать сначала
        </Button>
      </Box>
    </Paper>
  );
}
