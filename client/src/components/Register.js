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
  LinearProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    masterPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { checkPasswordStrength } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = checkPasswordStrength(formData.masterPassword);

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

    // Validate passwords match
    if (formData.masterPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength.score < 3) {
      setError('Password is too weak. Please choose a stronger password.');
      setLoading(false);
      return;
    }

    try {
      // Generate salt client-side
      const salt = CryptoJS.lib.WordArray.random(32).toString();
      
      // Hash the master password client-side before sending to server
      const masterPasswordHash = CryptoJS.PBKDF2(formData.masterPassword, salt, {
        keySize: 8, // 32 bytes = 8 words
        iterations: 100000,
        hasher: CryptoJS.algo.SHA256
      }).toString();
      
      const response = await axios.post('/api/auth/register', {
        username: formData.username,
        masterPasswordHash: masterPasswordHash,
        salt: salt
      });
      
      if (response.data.message === 'User registered successfully') {
        // Redirect to login
        navigate('/login', { 
          state: { message: 'Registration successful! Please login with your credentials.' }
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.score >= 6) return 'success';
    if (passwordStrength.score >= 4) return 'warning';
    return 'error';
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Create your secure password manager account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
            helperText="This will encrypt all your stored passwords"
          />

          {formData.masterPassword && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Password Strength: {passwordStrength.strength}
                </Typography>
                <Typography variant="body2" color={`${getStrengthColor()}.main`}>
                  {passwordStrength.score}/7
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(passwordStrength.score / 7) * 100}
                color={getStrengthColor()}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {passwordStrength.feedback[0]}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Confirm Master Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            error={formData.confirmPassword && formData.masterPassword !== formData.confirmPassword}
            helperText={
              formData.confirmPassword && formData.masterPassword !== formData.confirmPassword
                ? 'Passwords do not match'
                : ''
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={
              loading || 
              !formData.username || 
              !formData.masterPassword || 
              !formData.confirmPassword ||
              formData.masterPassword !== formData.confirmPassword ||
              passwordStrength.score < 3
            }
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register; 