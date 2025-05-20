// src/component/family/FamilyDashboard.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { getJSON, postJSON } from '../../api';

export default function FamilyDashboard() {
  const [members, setMembers] = useState([]);
  const [open, setOpen]       = useState(false);
  const [childId, setChildId] = useState('');
  const navigate = useNavigate();

  // Загрузка списка детей
  useEffect(() => {
    getJSON('/api/family')
       .then(setMembers)
       .catch(err => console.error(err));
  }, []);

  // Пригласить ребёнка
  const handleInvite = () => {
    postJSON('/api/family/invite', { childId: Number(childId) })
      .then(() => {
        setMembers(prev => [
          ...prev,
          { id: Number(childId), name: `Ребёнок ${childId}`, purpose_name: '-', current_day: 0, total_days: 30 }
        ]);
        setOpen(false);
        setChildId('');
      })
      .catch(err => console.error(err));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 3 }}>
        <Typography variant="h4">Семейный дашборд</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Пригласить ребёнка
        </Button>
      </Box>

      <Grid container spacing={3} px={2}>
        {members.map(m => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}>
                  {m.name[0]}
                </Avatar>
                <Typography variant="h6">{m.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Курс: {m.purpose_name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(m.current_day / m.total_days) * 100} 
                  />
                  <Typography variant="caption">
                    День {m.current_day} из {m.total_days}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/profile/${m.id}`)}>
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Диалог приглашения */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Пригласить ребёнка</DialogTitle>
        <DialogContent>
          <TextField
            label="ID ребёнка"
            type="number"
            value={childId}
            onChange={e => setChildId(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleInvite} variant="contained">
            Пригласить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
