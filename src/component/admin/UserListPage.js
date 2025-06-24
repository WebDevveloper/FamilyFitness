import React, { useEffect, useState } from 'react';
import { getJSON } from '../../api';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getJSON('/api/admin/users')
      .then(({ users }) => setUsers(users))
      .catch(console.error);
  }, []);
  return (
    <Paper sx={{ p:2 }}>
      <Typography variant="h5" mb={2}>Пользователи</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Логин</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell>Активные</TableCell>
            <TableCell>Завершённые</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>{u.activeCourses}</TableCell>
              <TableCell>{u.completedCourses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
