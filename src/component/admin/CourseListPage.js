import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from '../../api/admin';

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' или 'edit'
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    name: '',
    count_day: 30,
    calories: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  function loadCourses() {
    fetchCourses()
      .then(data => setCourses(data.courses))
      .catch(console.error);
  }

  function handleOpenAdd() {
    setDialogMode('add');
    setCurrentCourse({ id: null, name: '', count_day: 30, calories: '' });
    setDialogOpen(true);
  }

  function handleOpenEdit(course) {
    navigate(`/admin/courses/${course.id}/edit`);
  }

  async function handleSave() {
    if (dialogMode === 'add') {
      await createCourse({
        name: currentCourse.name,
        count_day: currentCourse.count_day,
        calories: currentCourse.calories || null
      });
    } else {
      await updateCourse(currentCourse.id, {
        name: currentCourse.name,
        count_day: currentCourse.count_day,
        calories: currentCourse.calories || null
      });
    }
    setDialogOpen(false);
    loadCourses();
  }

  async function handleDelete(id) {
    if (window.confirm('Вы действительно хотите удалить курс?')) {
      await deleteCourse(id);
      loadCourses();
    }
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Админка: Курсы</Typography>
        <Button variant="contained" onClick={handleOpenAdd}>
          Новый курс
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Дней</TableCell>
              <TableCell>Калории</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map(course => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.totalDays}</TableCell>
                <TableCell>{course.calories ?? '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenEdit(course)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(course.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Диалог для быстрого добавления/редактирования */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {dialogMode === 'add' ? 'Новый курс' : 'Редактировать курс'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Название"
            fullWidth
            margin="dense"
            value={currentCourse.name}
            onChange={e =>
              setCurrentCourse(prev => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            label="Дней"
            type="number"
            fullWidth
            margin="dense"
            value={currentCourse.count_day}
            onChange={e =>
              setCurrentCourse(prev => ({
                ...prev,
                count_day: Number(e.target.value)
              }))
            }
          />
          <TextField
            label="Калории"
            type="number"
            fullWidth
            margin="dense"
            value={currentCourse.calories}
            onChange={e =>
              setCurrentCourse(prev => ({
                ...prev,
                calories: e.target.value === '' ? '' : Number(e.target.value)
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}