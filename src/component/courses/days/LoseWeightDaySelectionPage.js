import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../../api';

export default function CardioDaySelectionPage() {
  const navigate = useNavigate();
  const purposeId = 2;
  const totalDays = 30;
  const [currentDay, setCurrentDay] = useState(1);
  const [isOver, setIsOver]         = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    (async () => {
      try {
        const journal = await getJSON(`/api/journal/${purposeId}`);
        setCurrentDay(journal.current_day);
        setIsOver(Boolean(journal.is_over));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDaySelect = day => {
    if (!isOver && day <= currentDay) {
      navigate(`/lose-weight-training/days/${day}`);
    }
  };

  const handleReset = async () => {
    try {
      await postJSON(`/api/journal/${purposeId}/reset`, {});
      // повторно подгружаем
      const journal = await getJSON(`/api/journal/${purposeId}`);
      setCurrentDay(journal.current_day);
      setIsOver(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error)   return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Выберите день (текущий: {currentDay})
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
        }}
      >
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const disabled = isOver || day > currentDay;
          return (
            <Button
              key={day}
              variant={day < currentDay ? 'contained' : 'outlined'}
              disabled={disabled}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </Button>
          );
        })}
      </Box>
      <Box textAlign="center" sx={{ mt: 2 }}>
        <Button color="secondary" onClick={handleReset}>
          Сбросить курс
        </Button>
      </Box>
    </Paper>
  );
}