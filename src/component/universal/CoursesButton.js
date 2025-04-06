import React from 'react';
import { Grid, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

// Определяем массив кнопок с соответствующими маршрутами
const navButtons = [
  { label: 'Силовые', path: '/strength-training' },
  { label: 'Похудение', path: '/lose-weight-training' },
  { label: 'Кардио', path: '/cardio-training' }
];

export default function CoursesButton() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Grid container spacing={0} padding={2}>
      {navButtons.map((btn) => {
        // Определяем, активна ли данная кнопка:
        // Например, если текущий путь начинается с btn.path
        const isActive = location.pathname.startsWith(btn.path);
        return (
          <Grid item key={btn.path} marginRight={2}>
            <Button
              variant="contained"
              color={isActive ? 'success' : 'primary'}
              onClick={() => navigate(btn.path)}
            >
              {btn.label}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}
