import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  IconButton,
  Typography,
  Grid,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import {
  fetchAllExercises,
  fetchCourseExercises,
  addExerciseToCourse,
  removeExerciseFromCourse
} from '../../api/admin';

export default function CourseEditPage() {
  const { id: courseId } = useParams();           // берём ID из URL
  const [allExs,    setAllExs]    = useState([]);
  const [courseExs, setCourseExs] = useState([]);
  const [selectedEx,   setSelectedEx]   = useState('');
  const [selectedDay,  setSelectedDay]  = useState(1);

  useEffect(() => {
    if (!courseId) return;
    loadAll();
    loadCourse();
  }, [courseId]);

  async function loadAll() {
    const { exercises } = await fetchAllExercises();
    setAllExs(exercises);
  }

  async function loadCourse() {
    const { exercises } = await fetchCourseExercises(courseId);
    setCourseExs(exercises);
  }

  async function handleAdd() {
    if (!selectedEx || !selectedDay) return;
    await addExerciseToCourse(courseId, {
        exerciseId: selectedEx,
        day:          selectedDay
    });
    setSelectedEx('');
    setSelectedDay(1);
    loadCourse();
  }

  async function handleRemove(configId) {
    await removeExerciseFromCourse(courseId, configId);
    loadCourse();
  }

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Управление упражнениями курса №{courseId}
      </Typography>

      <Paper sx={{ p:2, mb:3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={5}>
            <Select
              fullWidth
              value={selectedEx}
              onChange={e => setSelectedEx(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Выберите упражнение
              </MenuItem>
              {allExs.map(ex => (
                <MenuItem key={ex.id} value={ex.id}>
                  {ex.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="День"
              type="number"
              fullWidth
              value={selectedDay}
              inputProps={{ min:1, max:30 }}
              onChange={e => setSelectedDay(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={handleAdd} disabled={!selectedEx}>
              Добавить
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" mb={1}>
        Текущие упражнения
      </Typography>
      <Paper>
        {courseExs.map(ex => (
          <Box
            key={ex.configId}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
            borderBottom="1px solid #ddd"
          >
            <Typography>
              День {ex.day}: {ex.name}
            </Typography>
            <IconButton onClick={() => handleRemove(ex.configId)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        {courseExs.length === 0 && (
          <Box p={2}>
            <Typography color="text.secondary">Упражнения ещё не добавлены.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
