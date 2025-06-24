import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { getJSON, postJSON } from '../../../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function UltimateDaySelectionPage({ purposeId: propPurposeId }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // если передан через URL параметр — возьмём его
  const { purposeId: paramPurposeId } = useParams();
  const purposeId = +propPurposeId || +paramPurposeId;

  const totalDays = 30;

  const [currentDay, setCurrentDay] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [journalId, setJournalId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { progress } = await getJSON('/api/courses/progress');
        const rec = progress.find(r => r.purposeId === purposeId);
        if (rec) {
          setCurrentDay(rec.currentDay);
          setIsOver(rec.isOver === 1);
          setJournalId(rec.journalId);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [purposeId]);

  const handleDay = day => {
    if (day <= currentDay) {
      navigate(`/${purposeId === 1 ? 'strength-training' : purposeId === 2 ? 'lose-weight-training' : 'cardio-training'}/days/${day}`, {
        state: { journalId },
      });
    }
  };

  const handleReset = async () => {
    if (!isOver) return;
    await postJSON('/api/courses/reset', { purposeId });
    window.location.reload();
  };

  if (loading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Paper
      sx={{
        p: 3,
        mt: 2,
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Выберите день курса
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          width: '100%',
          maxWidth: 900,
          gridTemplateColumns: `repeat(auto-fit, minmax(${isXs ? 64 : 80}px, 1fr))`,
          py: 4,
        }}
      >
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const disabled = day > currentDay;
          let variant = 'outlined';
          let color = 'inherit';

          if (day < currentDay) {
            variant = 'contained';
            color = 'success';
          } else if (day === currentDay) {
            variant = 'contained';
            color = 'primary';
          }

          return (
            <Button
              key={day}
              variant={variant}
              color={color}
              disabled={disabled}
              onClick={() => handleDay(day)}
              sx={{
                height: isXs ? 64 : 80,
                fontSize: isXs ? '1rem' : '1.25rem',
                fontWeight: 500,
              }}
            >
              {day}
            </Button>
          );
        })}
      </Box>

      <Box textAlign="center" sx={{ mt: 2 }}>
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
