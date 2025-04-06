import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {jwtDecode} from "jwt-decode";

export default function MainJournalPage() {
    const [courses, setCourses] = useState([]); // Хранение списка курсов
    const [selectedCourse, setSelectedCourse] = useState(null); // Выбранный курс
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");

    // Загрузка курсов с сервера
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Достаем токен
                console.log('Token from localStorage:', token); // Логируем токен
    
                if (!token) {
                    console.error('Пользователь не авторизован');
                    return;
                }

                // Декодируем токен, чтобы получить имя пользователя
                const decoded = jwtDecode(token);
                setUserName(decoded.name); // Устанавливаем имя в state
                
                const response = await fetch('http://localhost:5000/api/courses', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка загрузки курсов.');
                }
    
                const data = await response.json();
                setCourses(data); // Сохраняем полученные курсы
            } catch (error) {
                console.error('Ошибка при загрузке курсов:', error.message);
            }
        };
    
        fetchCourses();
    }, []);

    // Выбор курса
    const handleCourseSelect = (courseId) => {
        setSelectedCourse(courseId);
    };

    // Нажатие на день
    const handleDayClick = (day) => {
        if (selectedCourse) {
            navigate(`/journal/${selectedCourse}/day/${day}`);
        }
    };

    return (
        <Box>
            <Typography variant="h4" textAlign="center" gutterBottom>
                Добро пожаловать, {userName}!
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" marginBottom={4}>
                <Typography variant="h5">Список курсов</Typography>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <Box
                            key={course.id}
                            onClick={() => handleCourseSelect(course.id)}
                            sx={{
                                padding: 2,
                                marginBottom: 1,
                                backgroundColor: selectedCourse === course.id ? '#ddd' : '#f9f9f9',
                                border: '1px solid #ccc',
                                borderRadius: 4,
                                cursor: 'pointer',
                                width: '90%',
                                textAlign: 'center',
                            }}
                        >
                            {course.name}
                        </Box>
                    ))
                ) : (
                    <Typography>Курсы не найдены</Typography>
                )}
            </Box>

            <Grid container spacing={2} justifyContent="center">
                {[...Array(30)].map((_, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleDayClick(index + 1)}
                            disabled={!selectedCourse}
                        >
                            День {index + 1}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
