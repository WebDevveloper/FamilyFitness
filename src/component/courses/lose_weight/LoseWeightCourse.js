import React, { useState } from 'react'
import { Grid, Typography, CardMedia, Paper, Button, Snackbar, Alert } from '@mui/material';
import loseWeightCourseImage from '../../main/img/lose-weight.jpg';
import { useNavigate } from 'react-router-dom';
import CoursesButton from '../../universal/CoursesButton';
import { postJSON } from '../../../api';

export default function LoseWeightCourse() {
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

            await postJSON('/api/courses/start', { purposeId: 2 });

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || 'Ошибка выбора курса.');
            // }

            // const data = await response.json();
            setSnackbarMessage('Курс успешно выбран!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            // console.log('Ответ сервера:', data); // Для отладки
            // После успешного выбора курса переходим на страницу выбора дня
            navigate('/lose-weight-training/days');
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
                    Комплекс для похудения
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <CardMedia
                        component="img"
                        image={loseWeightCourseImage}
                        alt='Lose weigth'
                        sx={{ width: '100%', height: 'auto' }} // Устанавливаем ширину и высоту
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>      
                        <Typography variant="body2" color="text.secondary">
                            Этот курс содержит упражнения, эффективно сжигающие лишний жир тела
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
