import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';

export default function PriceCard() {
  const subscriptions = [
    { 
      title: 'Булочка', 
      price: '50 ₽', 
      benefits: [
        'На булочку',
        
      ]
    },
    { 
      title: 'Кофе', 
      price: '100 ₽', 
      benefits: [
        'На кофе'
      ]
    },
    { 
      title: 'Кофе с булочкой', 
      price: '500 ₽', 
      benefits: [
        "На кофе, булочку и немного сладостей"
      ]
    }
  ];

  return (
    <>
      <Typography gutterBottom variant="h5" component="div" textAlign={'center'}>
          Мы работаем бесплатно. 
      </Typography>
      <Typography gutterBottom variant="h5" component="div" textAlign={'center'}>
        Если вам понравилось, поддержите нас рублём
      </Typography>
      <Grid container spacing={2} style={{ marginTop: '20px', marginBottom: '20px' }}>
        
        {/* Карточки с ценами подписки */}
        {subscriptions.map((subscription, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} marginBottom={5}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {subscription.title}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  {subscription.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                  Преимущества:
                </Typography>
                <ul>
                  {subscription.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex}>
                      <Typography variant="body2" color="text.secondary" style={{ fontSize: '1.1rem' }}>
                        {benefit}
                      </Typography>
                    </li>
                  ))}
                </ul>
                <Button variant="contained" key={index} style={{ marginTop: '10px' }}>
                  Приобрести
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
