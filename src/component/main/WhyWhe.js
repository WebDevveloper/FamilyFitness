import React from 'react';
import { Grid, Typography, CardMedia, Paper } from '@mui/material';
import aboutUsImage from "./img/why-we.jpg";

export default function WhyWe() {
  return (
    <Paper elevation={3} sx={{ padding: 2, height: 'auto', marginBottom: 10 }}>
        <Typography variant="h5" component="div" 
        textAlign={'center'} marginBottom={5}>
            Почему мы
          </Typography>
      <Grid container spacing={2} alignItems="center" padding={1}>
        <Grid item xs={12} sm={6} md={6}>
          <CardMedia
            component="img"
            image={aboutUsImage}
            alt='eblan'
            sx={{ width: '100%', height: 'auto' }} // Устанавливаем ширину и высоту
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} flexDirection={'column'}>
          
          <Typography variant="body2" color="text.secondary" fontSize={25}>
            Наша команда изучает воздействие физической активности на человека много лет.
            Мы регулярно консультируемся с лучшими специалистами в области человеческого тела
            ради гарантированного результата в улучшении вашего тела.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
