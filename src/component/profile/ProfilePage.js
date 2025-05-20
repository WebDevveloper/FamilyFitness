import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Paper, Typography,
  Grid, CircularProgress, Alert
} from '@mui/material';
import { getJSON } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [prog, setProg] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async()=>{
      const u   = await getJSON('/api/profile');
      const data= await getJSON('/api/courses/progress');
      setUser(u);
      setProg(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <CircularProgress />;

  const active   = prog.filter(c=>c.is_over===0);
  const complete = prog.filter(c=>c.is_over===1);

  return (
    <Box>
      <Paper sx={{ p:3, mb:3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={user.avatar} sx={{ width:80, height:80 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body2">ID: {user.id}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6">Активные курсы</Typography>
      {active.length === 0 && <Typography>Нет активных</Typography>}
      {active.map(c => (
        <Paper key={c.id} sx={{ p:2, mb:1 }}>
          <Typography><b>{c.name}</b></Typography>
          <Typography>Начало: {c.dateStarted}</Typography>
          <Typography>День {c.current_day} из {c.total_days}</Typography>
          <Button onClick={()=>nav(
            c.name.toLowerCase().includes('сила')   ? '/strength-training/days'
          : c.name.toLowerCase().includes('похудение')? '/lose-weight-training/days'
          : '/cardio-training/days'
          )}>
            Продолжить
          </Button>
        </Paper>
      ))}

      <Typography variant="h6" sx={{ mt:3 }}>Завершённые курсы</Typography>
      {complete.length === 0 && <Typography>Нет завершённых</Typography>}
      {complete.map(c => (
        <Paper key={c.id} sx={{ p:2, mb:1 }}>
          <Typography><b>{c.name}</b></Typography>
          <Typography>Начало: {c.dateStarted}</Typography>
          <Typography>Конец: {c.dateEnded}</Typography>
          <Typography>Сожжено калорий: {Math.round(c.burnedCalories)}</Typography>
        </Paper>
      ))}
    </Box>
  );
}