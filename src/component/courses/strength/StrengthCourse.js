import React, { useState } from 'react';
import {
  Grid,
  Typography,
  CardMedia,
  Paper,
  Button,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import strengthCourseImage from '../../main/img/strength-course.jpg';
import { useNavigate } from 'react-router-dom';
import CoursesButton from '../../universal/CoursesButton';
import { postJSON } from '../../../api';

export default function StrengthCourse() {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCourseSelect = async () => {
    try {
      await postJSON('/api/courses/start', { purposeId: 1 });
      setSnackbar({ open: true, message: 'Курс “Сила” запущен!', severity: 'success' });
      navigate('/strength-training/days');
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
  };

  return (
    <>
      <CoursesButton />
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" textAlign="center">Силовая тренировка</Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <CardMedia component="img" image={strengthCourseImage} alt="Сила" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              Интенсивная силовая нагрузка для наращивания мышечной массы и выносливости.
            </Typography>
          </Grid>
        </Grid>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleCourseSelect}>
            Приступить
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
