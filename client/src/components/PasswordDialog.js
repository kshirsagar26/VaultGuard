import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  VpnKey as VpnKeyIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';


const PasswordDialog = ({
  open,
  onClose,
  password,
  formData,
  onFormChange,
  onSave,
  onGeneratePassword,
}) => {
  const isEditing = !!password;
  const { checkPasswordStrength } = useAuth();
  const { mode } = useTheme();

  const handleFormChange = (field, value) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    // Calculate password strength when password field changes
    if (field === 'password') {
      const strengthResult = checkPasswordStrength(value);
      updatedFormData.strength = strengthResult.score;
      updatedFormData.strengthText = strengthResult.strength;
      updatedFormData.strengthFeedback = strengthResult.feedback;
    }
    
    onFormChange(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    if (formData.title && formData.password) {
      console.log('Calling onSave...');
      onSave();
    } else {
      console.log('Form validation failed:', { title: formData.title, password: formData.password });
    }
  };

  const categories = [
    'General',
    'Social Media',
    'Email',
    'Banking',
    'Shopping',
    'Work',
    'Entertainment',
    'Gaming',
    'Education',
    'Other'
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pr: 6 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VpnKeyIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ color: '#1e293b' }}>
                {isEditing ? 'Edit Password' : 'Add New Password'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {isEditing ? 'Update your password details' : 'Create a new secure password entry'}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#64748b',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.05)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Favorite Toggle */}
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.favorite}
                      onChange={(e) => handleFormChange('favorite', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#f59e0b',
                          '&:hover': {
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#f59e0b',
                        },
                      }}
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      {formData.favorite ? (
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                      ) : (
                        <StarBorderIcon sx={{ fontSize: 16, color: '#64748b' }} />
                      )}
                      <Typography variant="body2" sx={{ color: formData.favorite ? '#f59e0b' : '#64748b' }}>
                        Mark as Favorite
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>

            {/* Username */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => handleFormChange('username', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'light' ? '#e2e8f0' : '#475569',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
                    },
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Password */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={onGeneratePassword}
                        edge="end"
                        sx={{ color: mode === 'light' ? '#6366f1' : '#a78bfa' }}
                      >
                        <VpnKeyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Password Strength */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: formData.strengthText === 'Strong' 
                    ? (mode === 'light' ? '#f0fdf4' : '#064e3b') 
                    : formData.strengthText === 'Medium' 
                    ? (mode === 'light' ? '#fffbeb' : '#451a03') 
                    : (mode === 'light' ? '#fef2f2' : '#450a0a'),
                  border: `1px solid ${
                    formData.strengthText === 'Strong' 
                      ? (mode === 'light' ? '#bbf7d0' : '#065f46') 
                      : formData.strengthText === 'Medium' 
                      ? (mode === 'light' ? '#fed7aa' : '#78350f') 
                      : (mode === 'light' ? '#fecaca' : '#7f1d1d')
                  }`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={600} sx={{
                    color: formData.strengthText === 'Strong' 
                      ? (mode === 'light' ? '#10b981' : '#34d399') 
                      : formData.strengthText === 'Medium' 
                      ? (mode === 'light' ? '#f59e0b' : '#fbbf24') 
                      : (mode === 'light' ? '#ef4444' : '#f87171')
                  }}>
                    {formData.strengthText || 'Very Weak'}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: mode === 'light' ? '#64748b' : '#cbd5e1' 
                  }}>
                    Password Strength
                  </Typography>
                  {formData.strengthFeedback && formData.strengthFeedback.length > 0 && (
                    <Typography variant="caption" sx={{ 
                      color: mode === 'light' ? '#64748b' : '#cbd5e1', 
                      display: 'block', 
                      mt: 0.5,
                      fontSize: '0.7rem'
                    }}>
                      {formData.strengthFeedback[0]}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website URL"
                value={formData.url}
                onChange={(e) => handleFormChange('url', e.target.value)}
                placeholder="https://example.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                multiline
                rows={3}
                placeholder="Add any additional notes or reminders..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                  Tags (optional)
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => {
                        const newTags = formData.tags.filter((_, i) => i !== index);
                        handleFormChange('tags', newTags);
                      }}
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        '& .MuiChip-deleteIcon': {
                          color: '#64748b',
                        },
                      }}
                    />
                  ))}
                  {formData.tags.length < 5 && (
                    <Chip
                      label="+ Add Tag"
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const newTag = prompt('Enter tag name:');
                        if (newTag && newTag.trim()) {
                          handleFormChange('tags', [...formData.tags, newTag.trim()]);
                        }
                      }}
                      sx={{
                        borderColor: '#6366f1',
                        color: '#6366f1',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.1)',
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#6366f1',
                color: '#6366f1',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.title || !formData.password}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
              },
            }}
          >
            {isEditing ? 'Update Password' : 'Save Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PasswordDialog; 