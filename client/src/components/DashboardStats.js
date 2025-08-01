import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';


const DashboardStats = ({ 
  passwords, 
  recentActivity 
}) => {
  const { mode } = useTheme();
  const totalPasswords = passwords.length;
  const strongPasswords = passwords.filter(p => p.strength >= 4).length;
  const mediumPasswords = passwords.filter(p => p.strength >= 2 && p.strength < 4).length;
  const weakPasswordsCount = passwords.filter(p => p.strength < 2).length;
  const favoritePasswords = passwords.filter(p => p.favorite).length;
  const categories = [...new Set(passwords.map(p => p.category))];



  const stats = [
    {
      title: 'Total Passwords',
      value: totalPasswords,
      icon: <VpnKeyIcon />,
      color: mode === 'light' 
        ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
        : 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
      trend: '+12%',
      trendDirection: 'up',
    },
    {
      title: 'Strong Passwords',
      value: strongPasswords,
      icon: <CheckCircleIcon />,
      color: mode === 'light' 
        ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
        : 'linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)',
      trend: `${Math.round((strongPasswords / totalPasswords) * 100)}%`,
      trendDirection: 'up',
    },
    {
      title: 'Favorites',
      value: favoritePasswords,
      icon: <StarIcon />,
      color: mode === 'light' 
        ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
        : 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)',
      trend: `${Math.round((favoritePasswords / totalPasswords) * 100)}%`,
      trendDirection: 'up',
    },
  ];



  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
                         <Card
               sx={{
                 height: '100%',
                 background: 'background.paper',
                 border: '1px solid',
                 borderColor: 'divider',
                 transition: 'all 0.3s ease',
                 '&:hover': {
                   transform: 'translateY(-2px)',
                   boxShadow: mode === 'light' 
                     ? '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
                     : '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
                 },
               }}
             >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: stat.color,
                      color: 'white',
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                                    <Box display="flex" alignItems="center" gap={0.5}>
                    {stat.trendDirection === 'up' ? (
                      <TrendingUpIcon sx={{ 
                        color: mode === 'light' ? '#10b981' : '#34d399', 
                        fontSize: 16 
                      }} />
                    ) : (
                      <TrendingDownIcon sx={{ 
                        color: mode === 'light' ? '#ef4444' : '#f87171', 
                        fontSize: 16 
                      }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.trendDirection === 'up' 
                          ? (mode === 'light' ? '#10b981' : '#34d399')
                          : (mode === 'light' ? '#ef4444' : '#f87171'),
                        fontWeight: 600,
                      }}
                    >
                      {stat.trend}
                    </Typography>
                  </Box>
                </Box>
                                 <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                   {stat.value}
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                   {stat.title}
                 </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardStats; 