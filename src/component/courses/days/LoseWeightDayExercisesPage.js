import React, { useEffect, useState } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../../api';

export default function LoseWeightDayExercisesPage() {
  const { day } = useParams();
  const navigate = useNavigate();
  const purposeId = 2;
  const [exercises, setExercises] = useState([]);
  const [counters, setCounters]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [snackbar, setSnackbar]   = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    (async () => {
      try {
        const { exercises: all } = await getJSON(`/api/courses/exercises/${purposeId}`);
        const list = all.filter(e => e.day === Number(day));
        setExercises(list);
        setCounters(Array(list.length).fill(0));
      } catch (e) {
        setSnackbar({ open: true, message: e.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [day]);

  const completeDay = async () => {
    try {
      const { progress } = await getJSON('/api/courses/progress');
      const rec = progress.find(r => r.purposeId === purposeId);
      await postJSON('/api/courses/complete', { journalId: rec.journalId });
      setSnackbar({ open: true, message: 'День завершён', severity: 'success' });
      setTimeout(() => navigate('/lose-weight-training/days'), 1500);
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
  };

  const increment = idx => {
    setCounters(c => c.map((v, i) => i === idx && v < 5 ? v + 1 : v));
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" textAlign="center">Упражнения на день {day}</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {exercises.map((ex, i) => (
          <Grid item xs={12} key={ex.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{ex.name}</Typography>
              <Typography>{ex.about}</Typography>
              <Typography><strong>Как делать:</strong> {ex.how_to_do}</Typography>
              <Button
                onClick={() => increment(i)}
                disabled={counters[i] >= 5}
                sx={{ mt: 1 }}
              >
                Подходы: {counters[i]}/5
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={completeDay}
      >
        Завершить день
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}
