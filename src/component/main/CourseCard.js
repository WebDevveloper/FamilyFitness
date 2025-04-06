import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Используй Grid
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


import strengthCourseImage from './img/strength-course.jpg';
import loseWeightCourseImage from './img/lose-weight.jpg';
import cardioCourseImage from './img/cardio.jpg';



export default function CourseCard() {
  const navigate = useNavigate();
  return (
    <div>
        {/* Главный контейнер с карточками программ тренировок */}
        <Typography textAlign={'center'} variant='h4' 
         marginBottom={10}>
            Программы тренировок
        </Typography>
      <Grid container spacing={2} height={400} justifyContent={'space-around'}>
        
        {/* Карточки с изображениями и описаниями */}
          <Grid item xs={12} sm={6} md={3} >

            {/* Карточка 1 (Силовые тренировки) */}
            <Tooltip title="Силовые тренировки направленны на увеличение 
            силы мышц" placement="bottom">
              <Button 
                onClick={() => navigate('/strength-training')}
                sx={
                    {
                      textAlign: 'left',
                      "&:hover":{
                        backgroundColor: 'primary.dark', // Цвет кнопки при наведении
                        transform: 'scale(1.05)', // Увеличение кнопки при наведении
                      },
                    }
                  }
                >
                <Card sx={{ height: '300px' }}> {/* Увеличиваем высоту карточки */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={strengthCourseImage}
                    alt="musscle strength"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Силовые 
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Для укрепления тела
                    </Typography>
                  </CardContent>
                </Card>
              </Button>
            </Tooltip>
          </Grid>

            {/* Карточка 2 (Тренировки для похудения) */}
          <Grid item xs={12} sm={6} md={3} >
            <Tooltip title="Этот курс поможет вам сбросить лишний вес" placement="bottom">
              <Button 
                onClick={() => navigate('/lose-weight-training')}
                sx={
                    {
                      textAlign: 'left',
                      "&:hover":{
                        backgroundColor: 'primary.dark', // Цвет кнопки при наведении
                        transform: 'scale(1.05)', // Увеличение кнопки при наведении
                      },
                    }
                  }
              >
                <Card sx={{ height: '300px' }}> {/* Увеличиваем высоту карточки */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={loseWeightCourseImage}
                    alt="weight lose"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Похудение 
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Для сброса лишнего веса
                    </Typography>
                  </CardContent>
                </Card>
              </Button>
            </Tooltip>
          </Grid>

            {/* Карточка 3 (Кардио тренировки) */}
          <Grid item xs={12} sm={6} md={3} >
            <Tooltip title="Кардио тренировки полезны для сердца" placement="bottom">
            <Button 
              onClick={() => navigate('/cardio-training')}
              sx={
                    {
                      textAlign: 'left',
                      "&:hover":{
                        backgroundColor: 'primary.dark', // Цвет кнопки при наведении
                        transform: 'scale(1.05)', // Увеличение кнопки при наведении
                      },
                    }
                  }
              >
                <Card sx={{ height: '300px' }}> {/* Увеличиваем высоту карточки */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={cardioCourseImage}
                    alt="cardio"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Кардио 
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Для сердечно сосудистой системы
                    </Typography>
                  </CardContent>
                </Card>
              </Button>
            </Tooltip>
          </Grid>
      </Grid>
    </div>
  );
}
