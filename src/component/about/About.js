import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import photo from './img/sport2.jpg';

export default function About() {
  return (
    <>
    <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
      {/* Заголовок */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: '2.5rem', textAlign: 'center' }}>
        О нас
      </Typography>

      {/* Основной текст */}
      <Typography variant="h6" paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.6, textAlign: 'justify' }}>
        Добро пожаловать в наше фитнес-приложение! Наша миссия — помочь вам обрести здоровый и активный образ жизни, не выходя из дома.
        Мы создали это приложение для того, чтобы каждый мог тренироваться в удобном для себя режиме без необходимости посещать спортивный зал.
      </Typography>

      <Typography variant="h6" paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.6, textAlign: 'justify' }}>
        Наши программы разработаны профессиональными тренерами и специалистами в области фитнеса, что позволяет подобрать оптимальные
        упражнения для любой цели: от силовых тренировок до кардио и программ для похудения. Все тренировки можно выполнять дома, используя только
        собственное тело, что делает наше приложение универсальным и доступным.
      </Typography>

      <Typography variant="h6" paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.6, textAlign: 'justify' }}>
        С помощью нашего приложения вы сможете отслеживать свой прогресс, ставить цели и получать персональные рекомендации по тренировкам и питанию.
        Мы постоянно обновляем контент, добавляя новые программы и упражнения, чтобы вы всегда находили для себя что-то новое и интересное.
      </Typography>

      {/* Раздел с изображением и дополнительным текстом */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={photo} // замените на реальный путь к картинке
            alt="Фитнес тренировка"
            sx={{ width: '100%', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6} mb={6}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: '2rem', textAlign: 'center' }}>
            Наша философия
          </Typography>
          <Typography variant="h6" paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.6, textAlign: 'justify' }}>
            Наше приложение ориентировано на людей, которые хотят улучшить свою физическую форму, независимо от уровня подготовки.
            Мы предлагаем комплексные решения: от простых упражнений для начинающих до интенсивных программ для опытных спортсменов.
          </Typography>
          <Typography variant="h6" paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.6, textAlign: 'justify' }}>
            Мы верим, что регулярные тренировки — это залог здоровья, уверенности в себе и положительного настроения.
            Присоединяйтесь к нашему сообществу, где вы найдете поддержку, мотивацию и полезные советы, а также сможете делиться
            своими достижениями с другими пользователями.
          </Typography>
          <Typography variant="h6" paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.6, textAlign: 'justify' }}>
            Наше приложение постоянно развивается, и мы стремимся сделать его максимально удобным и функциональным.
            Здесь вы найдете не только тренировки, но и полезную информацию о правильном питании, восстановлении и психологической
            подготовке. Мы заботимся о вашем здоровье и делаем все, чтобы тренировки приносили только удовольствие и результаты.
          </Typography>
        </Grid>
      </Grid>
    </Container>
    </>
  );
}
