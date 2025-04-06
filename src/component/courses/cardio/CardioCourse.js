import React, { useState } from 'react'
import { Grid, Typography, CardMedia, Paper, Button, Snackbar, Alert } from '@mui/material';
import cardioCourseImage from "../../main/img/cardio.jpg";
import { useNavigate } from 'react-router-dom';
import CoursesButton from '../../universal/CoursesButton';

export default function CardioCourse() {
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error

    const handleCourseSelect = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setSnackbarMessage('Вы должны войти в систему для выбора курса.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            const response = await fetch('http://localhost:5000/api/cardio-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Передача токена
                },
                body: JSON.stringify({ purposeId: 3 }), // ID курса
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка выбора курса.');
            }

            const data = await response.json();
            setSnackbarMessage('Курс успешно выбран!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            console.log('Ответ сервера:', data); // Для отладки

            // После успешного выбора курса переходим на страницу выбора дня
            navigate('/cardio-training/days');
        } catch (error) {
            console.error('Ошибка выбора курса:', error.message);
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
  return (
        <>
            <CoursesButton  />

            <Paper elevation={3} sx={{ padding: 2, height: 'auto'}}>
                <Typography variant="h5" component="div" textAlign={'center'} >
                    Кардио
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <CardMedia
                        component="img"
                        image={cardioCourseImage}
                        alt='cardio'
                        sx={{ width: '100%', height: 'auto' }} // Устанавливаем ширину и высоту
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>      
                        <Typography variant="body2" color="text.secondary">
                            Кардио тренировки направленны на укрепление сердечно сосудистой системы
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Button variant="contained" onClick={handleCourseSelect}>
                            Приступить
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
  )
}
