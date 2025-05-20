import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../../api';
import {
  Grid, Typography, Paper, Button,
  Snackbar, Alert, CircularProgress, Box
} from '@mui/material';

export default function CardioDayExercisesPage() {
  const { day } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open:false, msg:'', sev:'success' });

  useEffect(() => {
    (async () => {
      try {
        // единообразный вызов через getJSON
        const data = await getJSON(`/api/exercises/3/${day}`);
        // Если сервер отдаёт сразу массив: setExercises(data);
        setExercises(data.exercises || data);
      } catch (e) {
        setSnack({ open:true, msg:e.message, sev:'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [day]);

  const completeDay = async () => {
    try {
      const res = await postJSON(`/api/journal/3/${day}/complete`, {});
      setSnack({ open:true, msg: res.message, sev:'success' });
      setTimeout(() => navigate('/cardio-training/days'), 1000);
    } catch (e) {
      setSnack({ open:true, msg:e.message, sev:'error' });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" gutterBottom>Упражнения: День {day}</Typography>
      <Grid container spacing={2}>
        {exercises.map(ex => (
          <Grid item xs={12} key={ex.id}>
            <Paper sx={{ p:2 }}>
              <Typography variant="h6">{ex.name}</Typography>
              <Typography paragraph>{ex.about}</Typography>
              <Typography variant="body2"><b>Как выполнять:</b> {ex.how_to_do}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" sx={{ mt:2 }} onClick={completeDay}>
        Завершить день
      </Button>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={()=>setSnack(s=>({...s,open:false}))}
      >
        <Alert severity={snack.sev}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}