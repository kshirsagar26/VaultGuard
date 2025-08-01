import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Fade,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Launch as LaunchIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';


const PasswordCard = ({
  password,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCopyPassword,
  onCopyUsername,
  onVisitUrl,
  showPassword = false,
  onTogglePasswordVisibility,
}) => {
  const { mode } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStrengthColor = (strength) => {
    if (strength >= 4) return mode === 'light' ? '#10b981' : '#34d399';
    if (strength >= 2) return mode === 'light' ? '#f59e0b' : '#fbbf24';
    return mode === 'light' ? '#ef4444' : '#f87171';
  };

  const getStrengthIcon = (strength) => {
    if (strength >= 4) return <CheckCircleIcon fontSize="small" />;
    if (strength >= 2) return <WarningIcon fontSize="small" />;
    return <ErrorIcon fontSize="small" />;
  };

  const getStrengthLabel = (strength) => {
    if (strength >= 4) return 'Strong';
    if (strength >= 2) return 'Medium';
    return 'Weak';
  };

  const getDomainFromUrl = (url) => {
    if (!url) return '';
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getInitials = (title) => {
    return title
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCardGradient = () => {
    if (password.favorite) {
      return mode === 'light' 
        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
        : 'linear-gradient(135deg, #451a03 0%, #78350f 100%)';
    }
    if (password.strength >= 4) {
      return mode === 'light' 
        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
        : 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)';
    }
    if (password.strength >= 2) {
      return mode === 'light' 
        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
        : 'linear-gradient(135deg, #451a03 0%, #78350f 100%)';
    }
    return mode === 'light' 
      ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
      : 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)';
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          height: '100%',
          background: getCardGradient(),
          border: password.favorite ? '2px solid' : '1px solid',
          borderColor: password.favorite 
            ? (mode === 'light' ? '#f59e0b' : '#fbbf24') 
            : 'divider',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' 
              ? '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)'
              : '0 20px 25px rgba(0, 0, 0, 0.3), 0 10px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        {/* Favorite Badge */}
        {password.favorite && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: 16,
              zIndex: 1,
            }}
          >
            <Badge
              badgeContent={<StarIcon sx={{ 
                fontSize: 12, 
                color: mode === 'light' ? '#f59e0b' : '#fbbf24' 
              }} />}
              sx={{
                '& .MuiBadge-badge': {
                  background: mode === 'light' ? 'white' : '#1e293b',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: mode === 'light' 
                    ? '0 2px 4px rgba(0, 0, 0, 0.1)'
                    : '0 2px 4px rgba(0, 0, 0, 0.3)',
                },
              }}
            />
          </Box>
        )}

        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: mode === 'light' 
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {getInitials(password.title)}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {password.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {password.username || 'No username'}
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* URL */}
          {password.url && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#3b82f6',
                  fontWeight: 500,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => onVisitUrl && onVisitUrl(password.url)}
              >
                {getDomainFromUrl(password.url)}
              </Typography>
            </Box>
          )}

          {/* Password Display */}
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: '#1e293b',
                  letterSpacing: '0.1em',
                }}
              >
                {showPassword ? password.password : '••••••••••••••••'}
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
                  <IconButton
                    size="small"
                    onClick={onTogglePasswordVisibility}
                    sx={{ color: '#64748b' }}
                  >
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={copiedField === 'password' ? 'Copied!' : 'Copy password'}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(password.password, 'password')}
                    sx={{ color: copiedField === 'password' ? '#10b981' : '#64748b' }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Tags and Status */}
          <Box display="flex" gap={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={password.category}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                borderColor: '#cbd5e1',
                color: '#64748b',
              }}
            />
            <Chip
              icon={getStrengthIcon(password.strength || 0)}
              label={getStrengthLabel(password.strength || 0)}
              size="small"
              sx={{
                fontSize: '0.75rem',
                background: getStrengthColor(password.strength || 0),
                color: 'white',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          </Box>

          {/* Notes */}
          {password.notes && (
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2,
                flexGrow: 1,
              }}
            >
              {password.notes}
            </Typography>
          )}

          {/* Action Buttons */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}
          >
            <Box display="flex" gap={1}>
              <Tooltip title={copiedField === 'username' ? 'Copied!' : 'Copy username'}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(password.username, 'username')}
                                     sx={{
                     color: copiedField === 'username' ? '#10b981' : '#64748b',
                    background: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {password.url && (
                <Tooltip title="Visit website">
                  <IconButton
                    size="small"
                    onClick={() => onVisitUrl && onVisitUrl(password.url)}
                    sx={{
                      color: '#64748b',
                      background: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    <LaunchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Tooltip title={password.favorite ? 'Remove from favorites' : 'Add to favorites'}>
              <IconButton
                size="small"
                onClick={() => onToggleFavorite(password.id)}
                sx={{
                  color: password.favorite ? '#f59e0b' : '#64748b',
                  background: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                {password.favorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: mode === 'light' 
                ? '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
                : '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
              border: `1px solid ${mode === 'light' ? '#e2e8f0' : '#475569'}`,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleCopy(password.username, 'username');
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Copy Username</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCopy(password.password, 'password');
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <CopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Copy Password</ListItemText>
          </MenuItem>
          {password.url && (
            <MenuItem
              onClick={() => {
                onVisitUrl && onVisitUrl(password.url);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <LaunchIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Visit Website</ListItemText>
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={() => {
              onToggleFavorite(password.id);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              {password.favorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {password.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              onEdit(password);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(password.id);
              handleMenuClose();
            }}
            sx={{ color: mode === 'light' ? '#ef4444' : '#f87171' }}
          >
            <ListItemIcon sx={{ color: mode === 'light' ? '#ef4444' : '#f87171' }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Card>
    </Fade>
  );
};

export default PasswordCard; 