import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Lock as LockIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const Login = () => {
  const { mode } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    masterPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, hashMasterPasswordForServer } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, get the user's salt to hash the password
      const saltResponse = await axios.get(`/api/auth/salt/${formData.username}`);
      const userSalt = saltResponse.data.salt;
      
      // Hash the master password client-side before sending to server
      const masterPasswordHash = hashMasterPasswordForServer(formData.masterPassword, userSalt);
      
      // Send only the hash to the server
      const response = await axios.post('/api/auth/login', {
        username: formData.username,
        masterPasswordHash: masterPasswordHash
      });
      
      if (response.data.message === 'Login successful') {
        login(
          response.data.user,
          response.data.salt,
          formData.masterPassword // Store the actual password client-side for encryption
        );
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.error || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 450,
          position: 'relative'
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            zIndex: 0
          }}
        />

        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            position: 'relative',
            zIndex: 1,
            boxShadow: mode === 'light'
              ? '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)'
              : '0 25px 50px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Logo and Branding */}
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                position: 'relative'
              }}
            >
              <ShieldIcon sx={{ color: 'white', fontSize: 40 }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white'
                }}
              >
                <LockIcon sx={{ color: 'white', fontSize: 12 }} />
              </Box>
            </Box>
            
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              VaultGuard
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: mode === 'light' ? '#64748b' : '#cbd5e1',
                fontWeight: 500,
                mb: 2
              }}
            >
              Secure Password Management
            </Typography>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ color: mode === 'light' ? '#94a3b8' : '#64748b' }}>
                Welcome Back
              </Typography>
            </Divider>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#ef4444'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: mode === 'light' ? '#6366f1' : '#a78bfa',
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Master Password"
              name="masterPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.masterPassword}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: mode === 'light' ? '#64748b' : '#cbd5e1' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                <Box display="flex" alignItems="center" gap={1}>
                  <SecurityIcon sx={{ fontSize: 16, color: mode === 'light' ? '#10b981' : '#34d399' }} />
                  <Typography variant="caption" sx={{ color: mode === 'light' ? '#64748b' : '#cbd5e1' }}>
                    This password encrypts all your stored passwords
                  </Typography>
                </Box>
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: mode === 'light' ? '#6366f1' : '#a78bfa',
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !formData.username || !formData.masterPassword}
              sx={{ 
                mt: 4, 
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                },
                '&:disabled': {
                  background: mode === 'light' ? '#e2e8f0' : '#475569',
                  color: mode === 'light' ? '#94a3b8' : '#64748b',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <Box display="flex" alignItems="center" gap={1}>
                  <LockIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Unlock Vault
                  </Typography>
                </Box>
              )}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" sx={{ color: mode === 'light' ? '#64748b' : '#cbd5e1' }}>
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  sx={{ 
                    color: mode === 'light' ? '#6366f1' : '#a78bfa',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Create one now
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login; 