// src/components/family/ChildProgressPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert
} from '@mui/material';
import { getJSON } from '../../api';

export default function ChildProgressPage() {
  const { childId } = useParams();
  const [progress, setProgress] = useState([]);
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProgress() {
      try {
        // 1) Загружаем имя ребёнка (если доступно)
        const { name } = await getJSON(`/api/family/${childId}/info`);
        setChildName(name);
        // 2) Загружаем прогресс
        const { progress } = await getJSON(`/api/family/${childId}/progress`);
        setProgress(progress);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [childId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Прогресс ребёнка {childName}
      </Typography>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Курс</TableCell>
              <TableCell align="right">Текущий день</TableCell>
              <TableCell align="right">Всего дней</TableCell>
              <TableCell align="right">Прогресс</TableCell>
              <TableCell>Начало</TableCell>
              <TableCell>Окончание</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {progress.map(p => (
              <TableRow key={p.journalId}>
                <TableCell>{p.name}</TableCell>
                <TableCell align="right">{p.currentDay}</TableCell>
                <TableCell align="right">{p.totalDays}</TableCell>
                <TableCell align="right">
                  {Math.round((p.currentDay / p.totalDays) * 100)} %
                </TableCell>
                <TableCell>{p.dateStarted}</TableCell>
                <TableCell>{p.dateEnded || '–'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
