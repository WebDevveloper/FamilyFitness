import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { postJSON } from '../../api';
import { saveAccessToken } from './tokenStorage';

export default function SignUpForm() {
  const navigate = useNavigate();
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // отправляем запрос на POST /api/auth/login
      const { accessToken, refreshToken } = await postJSON('/api/auth/login', {
        name:     username,
        password
      });

      saveAccessToken(accessToken);
      // при необходимости сохранить refreshToken тоже...
      console.log('Токен сохранён в localStorage:', accessToken);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Ошибка при входе');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Вход
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Имя пользователя"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            label="Пароль"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Box mt={2} mb={2}>
            <Typography variant="body2">
              Нет аккаунта?{' '}
              <RouterLink to="/registration" style={{ color: '#1976d2' }}>
                Зарегистрироваться
              </RouterLink>
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}