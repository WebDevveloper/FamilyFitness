// src/component/progress/ProgressPage.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getJSON } from '../../api';

export default function ProgressPage() {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [data, setData]       = useState([]);

  // Загрузим членов семьи
  useEffect(() => {
    getJSON('/family')
      .then(setMembers)
      .catch(console.error);
  }, []);

  // При смене пользователя — загружаем логи
  useEffect(() => {
    if (!selected) return;
    getJSON(`/users/${selected}/exercise-logs`)
      .then(logs => {
        // Группируем по дате и считаем общее число подходов
        const grouped = logs.reduce((acc, { performed_at, reps }) => {
          const date = performed_at.split('T')[0];
          acc[date] = (acc[date] || 0) + (reps || 1);
          return acc;
        }, {});
        // Формируем массив для графика
        const chartData = Object.entries(grouped).map(([date, total]) => ({ date, total }));
        setData(chartData);
      })
      .catch(console.error);
  }, [selected]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Статистика прогресса
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="member-select-label">Член семьи</InputLabel>
        <Select
          labelId="member-select-label"
          value={selected || ''}
          label="Член семьи"
          onChange={e => setSelected(e.target.value)}
        >
          {members.map(m => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="Подходы" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
