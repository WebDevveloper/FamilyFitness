import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getJSON } from '../../api';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Загрузка «событий» — тренировок из журнала
    getJSON('/courses/progress')
      .then(data => {
        // Преобразуем в формат { title, start, end }
        const evs = data.map(item => ({
          title: `${item.purpose_name}: день ${item.current_day}`,
          start: new Date(item.end_date),   // для примера
          end:   new Date(item.end_date),
        }));
        setEvents(evs);
      })
      .catch(console.error);
  }, []);

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Календарь тренировок
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
    </Box>
  );
}