import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Box, Toolbar, IconButton,
  Typography, Menu, MenuItem, Button,
  Tooltip, Avatar, Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { AuthContext } from '../../contexts/AuthContext';

export default function ResponsiveAppBar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorNav, setAnchorNav] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);

  const pages = [
    { label: 'О нас',        path: '/about' },
    ...(user?.role === 'parent' ? [{ label: 'Семья', path: '/family' }] : []),
    { label: 'Курсы',        path: '/programs' },
    { label: 'Календарь',    path: '/calendar' },
    ...(user?.role === 'child' ? [{ label: 'Мой прогресс', path: '/progress' }] : []),
    ...(user?.role === 'admin' ? [{ label: 'Админка', path: '/admin/courses' }] : []),
  ];

  const settings = user
    ? [
        { label: 'Профиль', action: () => navigate('/profile') },
        { label: 'Выйти',   action: () => {
            localStorage.removeItem('accessToken');
            setUser(null);
            navigate('/');
          }
        }
      ]
    : [
        { label: 'Войти',       action: () => navigate('/signup') },
        { label: 'Регистрация', action: () => navigate('/registration') }
      ];

  const firstLetter = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Логотип из public/img/ */}
          <Box
            component="img"
            src="/img/blue-and-green-letter-F.jpg"
            alt="Logo"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', height: 40, mr: 2 }}
          />

          {/* мобильное меню */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={e => setAnchorNav(e.currentTarget)} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorNav}
              open={Boolean(anchorNav)}
              onClose={() => setAnchorNav(null)}
            >
              {pages.map(p => (
                <MenuItem key={p.path} onClick={() => { navigate(p.path); setAnchorNav(null); }}>
                  <Typography>{p.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* десктопное меню */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(p => (
              <Button
                key={p.path}
                onClick={() => navigate(p.path)}
                sx={{ color: 'white' }}
              >
                {p.label}
              </Button>
            ))}
          </Box>

          {/* меню пользователя */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={user?.name || 'Гость'}>
              <IconButton onClick={e => setAnchorUser(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar>{firstLetter}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorUser}
              open={Boolean(anchorUser)}
              onClose={() => setAnchorUser(null)}
              sx={{ mt: '45px' }}
            >
              {settings.map(s => (
                <MenuItem key={s.label} onClick={() => { s.action(); setAnchorUser(null); }}>
                  <Typography>{s.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
