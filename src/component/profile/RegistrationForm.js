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

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [username, setUsername]           = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [errorMessage, setErrorMessage]   = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают!');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // отправляем запрос на POST /api/auth/register
      const data = await postJSON('/api/auth/register', {
        name:     username,
        password
      });

      console.log('Успешная регистрация:', data);
      navigate('/'); // перенаправляем на главную
    } catch (err) {
      setErrorMessage(err.message || 'Ошибка при регистрации');
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
          Регистрация
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
          <TextField
            label="Подтверждение пароля"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <Box mt={2} mb={2}>
            <Typography variant="body2">
              Уже есть аккаунт?{' '}
              <RouterLink to="/signup" style={{ color: '#1976d2' }}>
                Войти
              </RouterLink>
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}