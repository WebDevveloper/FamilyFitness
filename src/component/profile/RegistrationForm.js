import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Alert 
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isSubmitting) return;

    const registerUser = async () => {
      const userData = {
        name: username,
        password,
      };

      try {
        const response = await fetch('http://localhost:5000/api/registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка при регистрации');
        }

        const data = await response.json();
        console.log('Успешная регистрация:', data);
        navigate('/'); // Перенаправление на главную страницу
      } catch (error) {
        console.error('Ошибка:', error.message);
        setErrorMessage(error.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    registerUser();
  }, [isSubmitting, navigate, username, password]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают!');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
  };

  return (
    <Box 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#C8E6C9'
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Регистрация
            </Typography>
            {/* Здесь можно добавить иллюстрацию, если необходимо */}
            {/* <Box 
              component="img" 
              src="/path/to/illustration.png" 
              alt="Регистрация" 
              sx={{ width: '100%', maxWidth: 200, mx: 'auto', mb: 2 }} 
            /> */}
          </Box>
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
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Пароль"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Подтверждение пароля"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Box mt={2} mb={2}>
              <Typography variant="body1">
                Уже есть аккаунт?{' '}
                <RouterLink 
                  to="/signup" 
                  style={{ textDecoration: 'none', color: '#1976d2' }}
                >
                  Войти
                </RouterLink>
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
