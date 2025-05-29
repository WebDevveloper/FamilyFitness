import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const { user } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // ждем, пока контекст устанавливает user, затем разрешаем рендер
    setChecked(true);
  }, [user]);

  if (!checked) return null;              // пока не проверили — ничего
  if (!user)    return <Navigate to="/signup" replace />;
  if (user.role !== 'admin')
    return <Navigate to="/" replace />;
  return <Outlet />;
}