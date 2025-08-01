import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Badge,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  VpnKey as VpnKeyIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ 
  open, 
  onClose, 
  user, 
  passwords, 
  onNavigate,
  currentView = 'dashboard'
}) => {
  const { mode } = useTheme();
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      badge: null,
    },
    {
      id: 'passwords',
      label: 'Passwords',
      icon: <VpnKeyIcon />,
      badge: passwords.length,
    },
  ];

  const bottomMenuItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      badge: null,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <AccountIcon />,
      badge: null,
    },
  ];

  const handleMenuClick = (itemId) => {
    onNavigate(itemId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
         <Drawer
       variant="permanent"
       sx={{
         width: 280,
         flexShrink: 0,
         '& .MuiDrawer-paper': {
           width: 280,
           boxSizing: 'border-box',
           background: mode === 'light' 
             ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
             : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
           color: 'white',
           border: 'none',
           boxShadow: mode === 'light' 
             ? '4px 0 20px rgba(0, 0, 0, 0.1)'
             : '4px 0 20px rgba(0, 0, 0, 0.3)',
         },
       }}
     >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
              <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                VaultGuard
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Secure Password Manager
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              display: { xs: 'flex', md: 'none' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* User Profile */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {passwords.length} passwords stored
            </Typography>
          </Box>
        </Box>
        

      </Box>

      {/* Main Menu */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleMenuClick(item.id)}
                selected={currentView === item.id}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: currentView === item.id ? 600 : 400,
                  }}
                />
                {item.badge && (
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                        color: 'white',
                        fontWeight: 600,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Bottom Menu */}
      <Box sx={{ py: 2 }}>
        <List>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleMenuClick(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                />
                {item.badge && (
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <ListItemButton
          onClick={() => handleMenuClick('logout')}
          sx={{
            borderRadius: 2,
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.2)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              color: '#ef4444',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 