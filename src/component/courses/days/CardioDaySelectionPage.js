import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../../api';

export default function CardioDaySelectionPage() {
  const navigate = useNavigate();
  const totalDays = 30;
  const purposeId = 3;
  const [currentDay, setCurrentDay] = useState(1);
  const [isOver, setIsOver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { journal } = await getJSON(`/api/journal/${purposeId}?t=${Date.now()}`);
        const rec = Array.isArray(journal) ? journal[0] : journal;
        setCurrentDay(+rec.current_day);
        setIsOver(rec.is_over === 1);
      } catch (_) {
        // если нет записи — считаем 1
        setCurrentDay(1);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Typography>Загрузка...</Typography>;

  const currentEffective = isOver ? totalDays+1 : currentDay;

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h5" textAlign="center">Выберите день</Typography>
      <Box
        sx={{
          display:'grid',
          gap:1,
          gridTemplateColumns: { xs:'1fr', sm:'repeat(6,1fr)' }
        }}
      >
        {Array.from({length:totalDays}, (_,i)=>i+1).map(day => (
          <Button
            key={day}
            variant="contained"
            color={ day < currentEffective ? 'success' : day===currentEffective ? 'primary' : 'inherit' }
            disabled={day>currentEffective}
            onClick={() => navigate(`/cardio-training/days/${day}`)}
          >
            {day}
          </Button>
        ))}
      </Box>
      {isOver && (
        <Button
          sx={{ mt:2 }}
          onClick={async()=>{
            await postJSON(`/api/journal/${purposeId}/reset`, {});
            setCurrentDay(1);
            setIsOver(false);
          }}
        >
          Начать сначала
        </Button>
      )}
    </Paper>
  );
}