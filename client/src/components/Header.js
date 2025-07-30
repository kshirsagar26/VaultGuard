import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LockIcon from '@mui/icons-material/Lock';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <LockIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Secure Password Manager
          </Typography>
        </Box>
        
        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              Welcome, {user?.username}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              variant="outlined"
              size="small"
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            {!isLoginPage && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/login')}
                variant="outlined"
                size="small"
              >
                Login
              </Button>
            )}
            {!isRegisterPage && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/register')}
                variant="outlined"
                size="small"
              >
                Register
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 