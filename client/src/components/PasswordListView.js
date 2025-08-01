import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Launch as LaunchIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const PasswordListView = ({
  passwords,
  onEdit,
  onDelete,
  onToggleFavorite,
  onVisitUrl,
  showPasswords,
  onTogglePasswordVisibility,
}) => {
  const { mode } = useTheme();
  const getStrengthColor = (strength) => {
    if (strength >= 6) return mode === 'light' ? '#10b981' : '#34d399';
    if (strength >= 4) return mode === 'light' ? '#f59e0b' : '#fbbf24';
    if (strength >= 2) return mode === 'light' ? '#ef4444' : '#f87171';
    return mode === 'light' ? '#6b7280' : '#9ca3af';
  };

  const getStrengthText = (strength) => {
    if (strength >= 6) return 'Strong';
    if (strength >= 4) return 'Medium';
    if (strength >= 2) return 'Weak';
    return 'Very Weak';
  };

  return (
    <Box>
      {passwords.map((password, index) => (
        <Card
          key={password.id}
          sx={{
            mb: 2,
            background: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            '&:hover': {
              boxShadow: mode === 'light' 
                ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                : '0 4px 12px rgba(0, 0, 0, 0.3)',
              borderColor: 'primary.main',
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              {/* Left side - Main content */}
              <Box flex={1}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: 'text.primary' }}>
                    {password.title}
                  </Typography>
                  {password.favorite && (
                    <FavoriteIcon sx={{ 
                      color: mode === 'light' ? '#f59e0b' : '#fbbf24', 
                      fontSize: 20 
                    }} />
                  )}
                  <Chip
                    label={password.category}
                    size="small"
                    sx={{
                      background: mode === 'light' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(167, 139, 250, 0.1)',
                      color: mode === 'light' ? '#6366f1' : '#a78bfa',
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={3} alignItems="center" mb={2}>
                  {password.username && (
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Username
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {password.username}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      Password
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          fontFamily: 'monospace',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {showPasswords[password.id] ? password.password : '••••••••••••••••'}
                      </Typography>
                    </Box>
                  </Box>

                  {password.url && (
                    <Box>
                                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      URL
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main' }}>
                      {password.url}
                    </Typography>
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" gap={1}>
                    <SecurityIcon sx={{ fontSize: 16, color: getStrengthColor(password.strength || 0) }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: getStrengthColor(password.strength || 0),
                        fontWeight: 600,
                      }}
                    >
                      {getStrengthText(password.strength || 0)}
                    </Typography>
                  </Box>
                </Stack>

                {password.notes && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                  >
                    {password.notes}
                  </Typography>
                )}
              </Box>

              {/* Right side - Actions */}
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title={showPasswords[password.id] ? 'Hide Password' : 'Show Password'}>
                  <IconButton
                    size="small"
                    onClick={() => onTogglePasswordVisibility(password.id)}
                    sx={{ color: mode === 'light' ? '#64748b' : '#94a3b8' }}
                  >
                    {showPasswords[password.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Toggle Favorite">
                  <IconButton
                    size="small"
                    onClick={() => onToggleFavorite(password.id)}
                    sx={{ 
                      color: password.favorite 
                        ? (mode === 'light' ? '#f59e0b' : '#fbbf24') 
                        : (mode === 'light' ? '#64748b' : '#94a3b8') 
                    }}
                  >
                    {password.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>

                {password.url && (
                  <Tooltip title="Visit Website">
                    <IconButton
                      size="small"
                      onClick={() => onVisitUrl(password.url)}
                      sx={{ color: mode === 'light' ? '#64748b' : '#94a3b8' }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title="Edit Password">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(password)}
                    sx={{ color: mode === 'light' ? '#6366f1' : '#a78bfa' }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete Password">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(password.id)}
                    sx={{ color: mode === 'light' ? '#ef4444' : '#f87171' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default PasswordListView; 