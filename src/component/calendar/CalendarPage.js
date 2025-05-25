// src/component/calendar/CalendarPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getJSON, postJSON } from '../../api';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents]               = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen]         = useState(false);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const navigate                          = useNavigate();

  // Загрузить прогресс и перевести в события
  useEffect(() => {
    (async () => {
      try {
        const { progress } = await getJSON('/api/courses/progress');
        const evs = progress.map(item => {
          const dateStr = item.end_date || item.dateStarted;
          const dateObj = new Date(dateStr);
          return {
            journalId:   item.journalId,
            purposeId:   item.purposeId,
            purposeName: item.name,
            day:         item.currentDay,
            start:       dateObj,
            end:         dateObj,
            title:       `${item.name}: день ${item.currentDay}`,
            allDay:      true,               // <-- помечаем как all-day
            isOver:      item.isOver === 1
          };
        });
        setEvents(evs);
      } catch (e) {
        if (e.statusCode === 401) navigate('/login');
        else setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Клик в свободное место календаря
  const handleSelectSlot = slotInfo => {
    if (loading) return;
    const clickedDate = slotInfo.start;
    // на свободный клик предлагаем отметить текущий день
    (async () => {
      try {
        const { progress } = await getJSON('/api/courses/progress');
        const rec = progress.find(r => r.isOver === 0);
        if (!rec) {
          setError('Нет активного курса');
          return;
        }
        // узнаём дату текущего дня
        const dayZero = new Date(rec.dateStarted);
        const expected = new Date(dayZero);
        expected.setDate(dayZero.getDate() + rec.currentDay - 1);

        if (clickedDate.toDateString() !== expected.toDateString()) {
          setError(`Можно отметить только день ${rec.currentDay}`);
          return;
        }

        setSelectedEvent({
          journalId:   rec.journalId,
          purposeName: rec.name,
          day:         rec.currentDay,
          start:       expected,
          allDay:      true,
          isOver:      false
        });
        setModalOpen(true);
      } catch (e) {
        if (e.statusCode === 401) navigate('/login');
        else setError(e.message);
      }
    })();
  };

  // Клик по уже существующему событию
  const handleSelectEvent = event => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Отметить выбранный день
  const completeDay = async () => {
    if (!selectedEvent || selectedEvent.isOver) return;
    setLoading(true);
    try {
      await postJSON('/api/courses/complete', {
        journalId: selectedEvent.journalId
      });
      // перезагрузим события
      const { progress } = await getJSON('/api/courses/progress');
      const evs = progress.map(item => {
        const d = new Date(item.end_date || item.dateStarted);
        return {
          journalId:   item.journalId,
          purposeId:   item.purposeId,
          purposeName: item.name,
          day:         item.currentDay,
          start:       d,
          end:         d,
          title:       `${item.name}: день ${item.currentDay}`,
          allDay:      true,
          isOver:      item.isOver === 1
        };
      });
      setEvents(evs);
      setModalOpen(false);
      setSelectedEvent(null);
    } catch (e) {
      if (e.statusCode === 401) navigate('/login');
      else setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Календарь тренировок
      </Typography>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 600 }}
      />

      <Dialog
        open={modalOpen && !!selectedEvent}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              {selectedEvent.isOver
                ? `День ${selectedEvent.day} уже отмечен`
                : `Отметить день ${selectedEvent.day}?`}
            </DialogTitle>
            <DialogContent>
              {selectedEvent.isOver ? (
                <Typography>
                  Этот день уже помечен как выполненный.
                </Typography>
              ) : (
                <Button
                  variant="contained"
                  onClick={completeDay}
                  disabled={loading}
                >
                  Отметить как выполненный
                </Button>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
