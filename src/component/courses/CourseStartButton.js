import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { postJSON } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function CourseStartButton({ purposeId, redirect }) {
  const [snack, setSnack] = useState({ open:false, msg:'', sev:'success' });
  const navigate = useNavigate();

  const start = async () => {
    try {
      await postJSON('/api/courses/complete', { purposeId });
      setSnack({ open:true, msg:'Курс запущен!', sev:'success' });
      setTimeout(() => navigate(redirect), 1000);
    } catch (e) {
      setSnack({ open:true, msg:e.message, sev:'error' });
    }
  };

  return (
    <>
      <Button variant="contained" onClick={start}>Приступить</Button>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={()=>setSnack(s=>({ ...s, open:false }))}
      >
        <Alert severity={snack.sev}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}
