import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Typography, Paper, Button,
  Snackbar, Alert, CircularProgress, Box
} from '@mui/material';
import { getJSON, postJSON } from '../../../api';

export default function CardioDayExercisesPage() {
  const { day } = useParams();              // номер дня
  const navigate = useNavigate();
  const purposeId = 1;                      // для кардио
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [counters, setCounters] = useState([]);

  // Загрузка упражнений
  useEffect(() => {
    (async () => {
      try {
        const all = await getJSON(`/api/courses/exercises/${purposeId}`);
        // здесь предполагаем, что сервер отдаёт поле `day`
        const dayEx = all.filter(e => e.day === Number(day));
        setExercises(dayEx);
        setCounters(new Array(dayEx.length).fill(0));
      } catch (err) {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [day]);

  // Отметить день выполненным
  const completeDay = async () => {
    try {
      const result = await postJSON(`/api/journal/${purposeId}/${day}/complete`, {});
      setSnackbar({ open: true, message: result.message, severity: 'success' });
      setTimeout(() => navigate('/strength-training/days'), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const incrementCounter = idx => {
    setCounters(cs => {
      const next = [...cs];
      if (next[idx] < 5) next[idx]++;
      return next;
    });
  };

  if (loading) return <CircularProgress />;

 return (
    <>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" align="center">Упражнения — День {day}</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {exercises.map((ex, i) => (
            <Grid item xs={12} key={ex.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{ex.name}</Typography>
                <Typography>{ex.about}</Typography>
                <Typography variant="body2"><strong>Как делать:</strong> {ex.how_to_do}</Typography>
                <Button
                  sx={{ mt: 1 }}
                  variant="outlined"
                  onClick={() => incrementCounter(i)}
                  disabled={counters[i] >= 5}
                >
                  Подходов: {counters[i]}/5
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button variant="contained" onClick={completeDay}>
            Завершить день
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}