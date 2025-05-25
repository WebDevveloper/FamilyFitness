// src/components/lose-weight/LoseWeightDayExercisesPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Grid, Button,
  CircularProgress, Snackbar, Alert, Box
} from '@mui/material';
import { getJSON, postJSON } from '../../../api';

export default function LoseWeightDayExercisesPage() {
  const { day } = useParams();
  const { state } = useLocation();
  const journalId = state?.journalId;
  const navigate = useNavigate();
  const purposeId = 2;

  const [exs, setExs]       = useState([]);
  const [counters, setCounters] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [snack, setSnack]       = useState({ open:false, message:'', severity:'success' });

  useEffect(() => {
    (async () => {
      try {
        const { exercises } = await getJSON(`/api/courses/exercises/${purposeId}`);
        const list = exercises.filter(e => e.day === Number(day));
        setExs(list);
        setCounters(new Array(list.length).fill(0));
      } catch (e) {
        setSnack({ open:true, message:e.message, severity:'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [day]);

  const handleIncrement = idx => {
    setCounters(cs => cs.map((v,i) => i===idx && v<5 ? v+1 : v));
  };

  const completeDay = async () => {
    try {
      await postJSON('/api/courses/complete', { journalId });
      setSnack({ open:true, message:'День завершён', severity:'success' });
      setTimeout(() => navigate('/lose-weight-training/days'), 1500);
    } catch (e) {
      setSnack({ open:true, message:e.message, severity:'error' });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p:3, mt:2 }}>
      <Typography variant="h5" textAlign="center">
        Упражнения на день {day} (похудение)
      </Typography>

      <Grid container spacing={2} sx={{ mt:2 }}>
        {exs.map((ex,i) => (
          <Grid item xs={12} key={ex.id}>
            <Paper sx={{ p:2 }}>
              <Typography variant="h6">{ex.name}</Typography>
              <Typography>{ex.about}</Typography>
              <Typography><b>Как делать:</b> {ex.how_to_do}</Typography>
              <Button
                variant="outlined"
                sx={{ mt:1 }}
                onClick={() => handleIncrement(i)}
                disabled={counters[i] >= 5}
              >
                Подходов: {counters[i]}/5
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" sx={{ mt:3 }}>
        <Button
          variant="contained"
          onClick={completeDay}
          disabled={!journalId}
        >
          Завершить день
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(s => ({ ...s, open:false }))}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Paper>
  );
}
