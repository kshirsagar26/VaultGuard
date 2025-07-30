import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Slider,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const PasswordGenerator = ({ open, onClose, onGenerate }) => {
  const { generatePassword, checkPasswordStrength } = useAuth();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateNewPassword = () => {
    try {
      const newPassword = generatePassword(length, options);
      setPassword(newPassword);
      setCopied(false);
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUsePassword = () => {
    onGenerate(password);
  };

  const handleOptionChange = (option) => {
    const newOptions = { ...options, [option]: !options[option] };
    
    // Ensure at least one option is selected
    if (Object.values(newOptions).every(opt => !opt)) {
      return;
    }
    
    setOptions(newOptions);
  };

  const passwordStrength = password ? checkPasswordStrength(password) : null;

  const getStrengthColor = () => {
    if (!passwordStrength) return 'default';
    if (passwordStrength.score >= 6) return 'success';
    if (passwordStrength.score >= 4) return 'warning';
    return 'error';
  };

  // Generate password when dialog opens
  React.useEffect(() => {
    if (open) {
      generateNewPassword();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Password Generator</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* Generated Password Display */}
          <TextField
            fullWidth
            label="Generated Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                  <IconButton onClick={handleCopy} edge="end">
                    <CopyIcon />
                  </IconButton>
                  <IconButton onClick={generateNewPassword} edge="end">
                    <RefreshIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {copied && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Password copied to clipboard!
            </Alert>
          )}

          {/* Password Strength Indicator */}
          {passwordStrength && (
            <Box sx={{ mt: 2 }}>
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

          {/* Length Slider */}
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>
              Password Length: {length}
            </Typography>
            <Slider
              value={length}
              onChange={(e, newValue) => setLength(newValue)}
              min={8}
              max={64}
              marks={[
                { value: 8, label: '8' },
                { value: 16, label: '16' },
                { value: 32, label: '32' },
                { value: 64, label: '64' }
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          {/* Character Options */}
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>
              Character Types
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeUppercase}
                  onChange={() => handleOptionChange('includeUppercase')}
                />
              }
              label="Uppercase Letters (A-Z)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeLowercase}
                  onChange={() => handleOptionChange('includeLowercase')}
                />
              }
              label="Lowercase Letters (a-z)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeNumbers}
                  onChange={() => handleOptionChange('includeNumbers')}
                />
              }
              label="Numbers (0-9)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.includeSymbols}
                  onChange={() => handleOptionChange('includeSymbols')}
                />
              }
              label="Special Characters (!@#$%^&*)"
            />
          </Box>

          {/* Preset Buttons */}
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>
              Quick Presets
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setLength(12);
                  setOptions({
                    includeUppercase: true,
                    includeLowercase: true,
                    includeNumbers: true,
                    includeSymbols: false
                  });
                  generateNewPassword();
                }}
              >
                Standard (12 chars)
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setLength(16);
                  setOptions({
                    includeUppercase: true,
                    includeLowercase: true,
                    includeNumbers: true,
                    includeSymbols: true
                  });
                  generateNewPassword();
                }}
              >
                Strong (16 chars)
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setLength(32);
                  setOptions({
                    includeUppercase: true,
                    includeLowercase: true,
                    includeNumbers: true,
                    includeSymbols: true
                  });
                  generateNewPassword();
                }}
              >
                Maximum (32 chars)
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleUsePassword}
          variant="contained"
          disabled={!password}
        >
          Use This Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordGenerator; 