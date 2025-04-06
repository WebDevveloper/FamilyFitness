import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Здесь можно добавить логику для обработки подписки
    console.log('Подписка на рассылку:', email);
    setEmail(''); // Очистка поля после отправки
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f8f8f8',
        padding: '20px',
        textAlign: 'center',
        marginTop: '20px',
        height: '150px'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Подпишитесь на нашу рассылку
      </Typography>
      <form onSubmit={handleSubmit} style={{marginRight: '100px'}}>
        <TextField
          variant="outlined"
          placeholder="Введите ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginRight: '10px', width: '300px' }}
          required
        />
        <Button variant="contained" type="submit" sx={{marginTop: "10px"}}>
          Подписаться
        </Button>
      </form>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px' }}>
        Мы уважаем вашу конфиденциальность. Ваш email не будет передан третьим лицам.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ marginTop: '30px' }}>
        All rights received. Direct by Silent ISiP 22/11
      </Typography>
    </Box>
  );
};

export default Footer;
