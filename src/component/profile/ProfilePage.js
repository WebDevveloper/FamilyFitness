import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  TextField,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Footer from '../universal/Footer';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Состояния редактирования профиля
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState(''); // Base64 строка изображения
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Получение данных профиля с сервера
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Пользователь не авторизован.');
        setLoading(false);
        return;
      }
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка получения профиля.');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Функция для конвертации файла в Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Обработка изменения файла аватара
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setEditAvatar(base64);
      } catch (err) {
        console.error("Ошибка преобразования файла", err);
      }
    }
  };

  // Отправка изменений профиля на сервер
  const handleProfileSave = async () => {
    try {
      setEditError('');
      setEditSuccess('');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setEditError('Пользователь не авторизован.');
        return;
      }
      const response = await fetch('http://localhost:5000/api/profile/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName, avatar: editAvatar })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка обновления профиля.');
      }
      const data = await response.json();
      setEditSuccess(data.message || 'Профиль обновлен успешно.');
      await fetchProfile();
      setEditMode(false);
    } catch (err) {
      console.error("Ошибка в editProfile:", err);
      setEditError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      {/* Обёртка, растянутая на всю ширину */}
      <Box sx={{ width: '100%', mt: 0, mb: 4, p: 0 }}>
        {/* Блок с информацией о пользователе */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                alt={profileData.user.name}
                src={profileData.user.avatar || ''}
                sx={{ width: isMobile ? 80 : 120, height: isMobile ? 80 : 120 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant={isMobile ? 'h5' : 'h4'}>
                {profileData.user.name}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  setEditMode(true);
                  setEditName(profileData.user.name);
                  setEditAvatar(profileData.user.avatar);
                }}
              >
                Редактировать профиль
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {editMode && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Редактирование профиля
            </Typography>
            {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
            {editSuccess && <Alert severity="success" sx={{ mb: 2 }}>{editSuccess}</Alert>}
            <Box component="form" noValidate autoComplete="off">
              <TextField
                fullWidth
                label="Имя"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                Загрузить аватар
                <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              </Button>
              {editAvatar && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Предпросмотр аватара:</Typography>
                  <Avatar src={editAvatar} sx={{ width: 80, height: 80 }} />
                </Box>
              )}
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained" onClick={handleProfileSave}>
                    Сохранить
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Отмена
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}

        {/* Блок с курсами */}
        <Grid container spacing={3}>
          {/* Активные курсы */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Активные курсы
              </Typography>
              {profileData.activeCourses && profileData.activeCourses.length > 0 ? (
                profileData.activeCourses.map((course) => (
                  <Box
                    key={course.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: '1px solid #ccc',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="body1">
                      Дата начала: {course.dateStarted}
                    </Typography>
                    <Typography variant="body1">
                      Сожжено калорий: {course.burnedCalories ? course.burnedCalories.toFixed(0) : 0}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1, alignSelf: 'flex-start' }}
                      onClick={() => {
                        if (course.name.toLowerCase().includes('сила')) {
                          navigate('/strength-training/days');
                        } else if (course.name.toLowerCase().includes('похудение')) {
                          navigate('/lose-weight-training/days');
                        } else if (course.name.toLowerCase().includes('кардио')) {
                          navigate('/cardio-training/days');
                        } else {
                          navigate('/');
                        }
                      }}
                    >
                      Продолжить
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">Нет активных курсов.</Typography>
              )}
            </Paper>
          </Grid>

          {/* Завершённые курсы */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Завершённые курсы
              </Typography>
              {profileData.completedCourses && profileData.completedCourses.length > 0 ? (
                profileData.completedCourses.map((course) => (
                  <Box
                    key={course.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: '1px solid #ccc',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="body1">
                      Дата начала: {course.dateStarted}
                    </Typography>
                    <Typography variant="body1">
                      Дата завершения: {course.dateEnded}
                    </Typography>
                    <Typography variant="body1">
                      Сожжено калорий:{' '}
                      {course.burnedCalories
                        ? course.burnedCalories.toFixed(0)
                        : course.calories}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">Нет завершённых курсов.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
     
    </>
  );
}
