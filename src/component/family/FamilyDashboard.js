import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, CardActions,
  Avatar, Typography, LinearProgress,
  Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions,
  Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getJSON, postJSON } from '../../api';

export default function FamilyDashboard() {
  const [members, setMembers] = useState([]);
  const [open,    setOpen]    = useState(false);
  const [childId, setChildId] = useState('');
  const [err,     setErr]     = useState('');
  const navigate = useNavigate();

  // 1) Загрузить список
  useEffect(() => {
    getJSON('/api/family')
      .then(data => setMembers(data))
      .catch(e => setErr(e.message));
  }, []);

  // 2) Приглашение
  const handleInvite = async () => {
    try {
      await postJSON('/api/family/invite', { childId: Number(childId) });
      // сразу обновляем весь список
      const data = await getJSON('/api/family');
      setMembers(data);
      setOpen(false);
      setChildId('');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <Box sx={{ bgcolor:'background.default', minHeight:'100vh', py:4 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', px:2, mb:3 }}>
        <Typography variant="h4">Семейный дашборд</Typography>
        <Button variant="contained" onClick={()=>setOpen(true)}>Пригласить ребёнка</Button>
      </Box>

      {err && (
        <Snackbar open onClose={()=>setErr('')}>
          <Alert severity="error" onClose={()=>setErr('')}>{err}</Alert>
        </Snackbar>
      )}

      <Grid container spacing={3} px={2}>
        {members.map(m => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={m.childId}>
            <Card>
              <CardContent sx={{ textAlign:'center' }}>
                <Avatar sx={{ width:56, height:56, mx:'auto', mb:1 }}>
                  {m.name.charAt(0)}
                </Avatar>
                <Typography variant="h6">{m.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Курс: {m.purpose_name || '—'}
                </Typography>
                <Box sx={{ mt:2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={ m.total_days ? (m.current_day / m.total_days)*100 : 0 }
                  />
                  <Typography variant="caption">
                    День {m.current_day} из {m.total_days || '—'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/family/${m.childId}`)}>
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* диалог */}
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Пригласить ребёнка</DialogTitle>
        <DialogContent>
          <TextField
            label="ID ребёнка"
            type="number"
            value={childId}
            onChange={e=>setChildId(e.target.value)}
            fullWidth margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleInvite}>Пригласить</Button>
        </DialogActions>
      </Dialog>
    </Box>
);
}
