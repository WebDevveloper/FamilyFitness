// src/component/family/ChildProgressPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert
} from '@mui/material';
import { getJSON } from '../../api';

export default function ChildProgressPage() {
  const { childId } = useParams();
  const [childInfo, setChildInfo]     = useState(null);
  const [progress, setProgress]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    (async () => {
      try {
        const infoResp = await getJSON(`/api/family/${childId}/info`);
        setChildInfo(infoResp);

        const progResp = await getJSON(`/api/family/${childId}/progress`);
        setProgress(progResp.progress);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [childId]);

  // если не родитель, редиректим
  if (error.includes('Доступ запрещён')) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={childInfo.avatar}
          sx={{ width: 64, height: 64, mr: 2 }}
        />
        <Typography variant="h4">
          Прогресс ребёнка: {childInfo.name}
        </Typography>
      </Box>

      <Paper sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Курс</TableCell>
              <TableCell align="right">День</TableCell>
              <TableCell align="right">Всего дней</TableCell>
              <TableCell align="right">Прогресс</TableCell>
              <TableCell>Начат</TableCell>
              <TableCell>Завершён</TableCell>
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
