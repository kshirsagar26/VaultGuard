import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Fab,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  AppBar,
  Toolbar,
  Switch,
  FormControlLabel,
  Slider,
  Rating,
  Skeleton,
  AlertTitle,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  VpnKey as VpnKeyIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  History as HistoryIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedUserIcon,
  LockPerson as LockPersonIcon,
  Password as PasswordIcon,
  Key as KeyIcon,
  QrCode as QrCodeIcon,
  Fingerprint as FingerprintIcon,
  Face as FaceIcon,
  Smartphone as SmartphoneIcon,
  Computer as ComputerIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Desktop as DesktopIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Sync as SyncIcon,
  Autorenew as AutorenewIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  BubbleChart as BubbleChartIcon,
  ScatterPlot as ScatterPlotIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  Update as UpdateIcon,
  GetApp as GetAppIcon,
  Publish as PublishIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  CloudSync as CloudSyncIcon,
  CloudOff as CloudOffIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  SignalCellular4Bar as SignalCellular4BarIcon,
  SignalCellular0Bar as SignalCellular0BarIcon,
  SignalWifi4Bar as SignalWifi4BarIcon,
  SignalWifi0Bar as SignalWifi0BarIcon,
  BatteryFull as BatteryFullIcon,
  BatteryEmpty as BatteryEmptyIcon,
  BatteryChargingFull as BatteryChargingFullIcon,
  BatteryUnknown as BatteryUnknownIcon,
  BrightnessHigh as BrightnessHighIcon,
  BrightnessLow as BrightnessLowIcon,
  BrightnessAuto as BrightnessAutoIcon,
  Contrast as ContrastIcon,
  Palette as PaletteIcon,
  ColorLens as ColorLensIcon,
  Brush as BrushIcon,
  FormatPaint as FormatPaintIcon,
  Style as StyleIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
  ViewHeadline as ViewHeadlineIcon,
  ViewStream as ViewStreamIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewCarousel as ViewCarouselIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewArray as ViewArrayIcon,
  ViewColumn as ViewColumnIcon,
  ViewSidebar as ViewSidebarIcon,
  ViewTimeline as ViewTimelineIcon,
  ViewKanban as ViewKanbanIcon,
  ViewInAr as ViewInArIcon,
  ViewComfyAlt as ViewComfyAltIcon,
  ViewCompactAlt as ViewCompactAltIcon,
  ViewHeadlineAlt as ViewHeadlineAltIcon,
  ViewStreamAlt as ViewStreamAltIcon,
  ViewWeekAlt as ViewWeekAltIcon,
  ViewDayAlt as ViewDayAltIcon,
  ViewAgendaAlt as ViewAgendaAltIcon,
  ViewCarouselAlt as ViewCarouselAltIcon,
  ViewQuiltAlt as ViewQuiltAltIcon,
  ViewArrayAlt as ViewArrayAltIcon,
  ViewColumnAlt as ViewColumnAltIcon,
  ViewSidebarAlt as ViewSidebarAltIcon,
  ViewTimelineAlt as ViewTimelineAltIcon,
  ViewKanbanAlt as ViewKanbanAltIcon,
  ViewInArAlt as ViewInArAltIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PasswordGenerator from './PasswordGenerator';

const Dashboard = () => {
  const { user, salt, masterPassword, deriveKey, encrypt, decrypt } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, compact
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [securityScore, setSecurityScore] = useState(85);
  const [weakPasswords, setWeakPasswords] = useState([]);
  const [duplicatePasswords, setDuplicatePasswords] = useState([]);
  const [expiredPasswords, setExpiredPasswords] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    title: '',
    username: '',
    password: '',
    notes: '',
    url: '',
    category: 'General',
    tags: [],
    favorite: false,
    expiryDate: null,
    strength: 0
  });

  useEffect(() => {
    loadPasswords();
    loadCategories();
    analyzeSecurity();
    loadRecentActivity();
  }, []);

  const loadPasswords = async () => {
    try {
      setLoading(true);
      const key = await deriveKey(masterPassword, salt);
      
      const response = await axios.get('/api/passwords', {
        params: {
          userId: user.id,
          masterPassword: masterPassword,
          salt: salt
        }
      });

      // Decrypt passwords on client side
      const decryptedPasswords = response.data.map(pwd => ({
        ...pwd,
        password: decrypt(pwd.password, key),
        notes: pwd.notes ? decrypt(pwd.notes, key) : ''
      }));

      setPasswords(decryptedPasswords);
    } catch (error) {
      console.error('Error loading passwords:', error);
      setError('Failed to load passwords');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get('/api/passwords/categories', {
        params: { userId: user.id }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const analyzeSecurity = () => {
    // Analyze password strength and security issues
    const weak = passwords.filter(pwd => pwd.strength < 3);
    const duplicates = findDuplicatePasswords();
    const expired = passwords.filter(pwd => pwd.expiryDate && new Date(pwd.expiryDate) < new Date());
    
    setWeakPasswords(weak);
    setDuplicatePasswords(duplicates);
    setExpiredPasswords(expired);
    
    // Calculate security score
    const totalIssues = weak.length + duplicates.length + expired.length;
    const maxIssues = passwords.length * 0.3; // Assume 30% issues is max
    const score = Math.max(0, 100 - (totalIssues / maxIssues) * 100);
    setSecurityScore(Math.round(score));
  };

  const findDuplicatePasswords = () => {
    const passwordMap = new Map();
    const duplicates = [];
    
    passwords.forEach(pwd => {
      if (passwordMap.has(pwd.password)) {
        duplicates.push(pwd);
        duplicates.push(passwordMap.get(pwd.password));
      } else {
        passwordMap.set(pwd.password, pwd);
      }
    });
    
    return duplicates;
  };

  const loadRecentActivity = () => {
    // Mock recent activity data
    setRecentActivity([
      { id: 1, action: 'Login', timestamp: new Date(), device: 'Chrome on Windows', location: 'New York, US' },
      { id: 2, action: 'Password Updated', timestamp: new Date(Date.now() - 3600000), item: 'Gmail Account' },
      { id: 3, action: 'New Password Added', timestamp: new Date(Date.now() - 7200000), item: 'Netflix' },
      { id: 4, action: 'Security Scan', timestamp: new Date(Date.now() - 86400000), result: '2 weak passwords found' }
    ]);
  };

  const handleAddPassword = () => {
    setEditingPassword(null);
    setPasswordForm({
      title: '',
      username: '',
      password: '',
      notes: '',
      url: '',
      category: 'General',
      tags: [],
      favorite: false,
      expiryDate: null,
      strength: 0
    });
    setShowPasswordDialog(true);
  };

  const handleEditPassword = (password) => {
    setEditingPassword(password);
    setPasswordForm({
      title: password.title,
      username: password.username || '',
      password: password.password,
      notes: password.notes || '',
      url: password.url || '',
      category: password.category || 'General',
      tags: password.tags || [],
      favorite: password.favorite || false,
      expiryDate: password.expiryDate || null,
      strength: password.strength || 0
    });
    setShowPasswordDialog(true);
  };

  const handleSavePassword = async () => {
    try {
      const key = await deriveKey(masterPassword, salt);
      
      const passwordData = {
        userId: user.id,
        masterPassword: masterPassword,
        salt: salt,
        title: passwordForm.title,
        username: passwordForm.username,
        password: encrypt(passwordForm.password, key),
        notes: passwordForm.notes ? encrypt(passwordForm.notes, key) : null,
        url: passwordForm.url,
        category: passwordForm.category,
        tags: passwordForm.tags,
        favorite: passwordForm.favorite,
        expiryDate: passwordForm.expiryDate,
        strength: passwordForm.strength
      };

      if (editingPassword) {
        await axios.put(`/api/passwords/${editingPassword.id}`, passwordData);
      } else {
        await axios.post('/api/passwords', passwordData);
      }

      setShowPasswordDialog(false);
      loadPasswords();
      loadCategories();
      analyzeSecurity();
    } catch (error) {
      console.error('Error saving password:', error);
      setError('Failed to save password');
    }
  };

  const handleDeletePassword = async (passwordId) => {
    try {
      await axios.delete(`/api/passwords/${passwordId}`, {
        params: { userId: user.id }
      });
      loadPasswords();
      loadCategories();
      analyzeSecurity();
    } catch (error) {
      console.error('Error deleting password:', error);
      setError('Failed to delete password');
    }
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
  };

  const handleCopyUsername = (username) => {
    navigator.clipboard.writeText(username);
  };

  const handleToggleFavorite = async (passwordId) => {
    // Toggle favorite status
    const updatedPasswords = passwords.map(pwd => 
      pwd.id === passwordId ? { ...pwd, favorite: !pwd.favorite } : pwd
    );
    setPasswords(updatedPasswords);
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || password.category === selectedCategory;
    const matchesFavorites = !showFavorites || password.favorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const handleMenuOpen = (event, password) => {
    setAnchorEl(event.currentTarget);
    setSelectedPassword(password);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPassword(null);
  };

  const getSecurityColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getStrengthColor = (strength) => {
    if (strength >= 4) return 'success';
    if (strength >= 2) return 'warning';
    return 'error';
  };

  const getStrengthLabel = (strength) => {
    if (strength >= 4) return 'Strong';
    if (strength >= 2) return 'Medium';
    return 'Weak';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Password Vault
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back, {user?.username} • {passwords.length} passwords stored
              </Typography>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={() => setShowSecurityPanel(!showSecurityPanel)}
              >
                Security Score: {securityScore}%
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddPassword}
                sx={{ 
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                }}
              >
                Add Password
              </Button>
            </Box>
          </Box>

                     {/* Security Score Bar */}
           <Paper sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                         <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
               <Typography variant="body2" fontWeight="bold" sx={{ color: 'white' }}>
                 Overall Security Score
               </Typography>
               <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                 {securityScore}%
               </Typography>
             </Box>
                         <LinearProgress 
               variant="determinate" 
               value={securityScore} 
               sx={{ 
                 height: 8, 
                 borderRadius: 4,
                 backgroundColor: 'rgba(255,255,255,0.3)',
                 '& .MuiLinearProgress-bar': {
                   backgroundColor: 'white'
                 }
               }}
             />
                         <Box display="flex" gap={2} sx={{ mt: 1 }}>
               <Chip 
                 icon={<WarningIcon />} 
                 label={`${weakPasswords.length} weak passwords`} 
                 sx={{ 
                   color: 'white', 
                   borderColor: 'white',
                   '& .MuiChip-icon': { color: 'white' }
                 }}
                 variant="outlined"
                 size="small" 
               />
               <Chip 
                 icon={<ErrorIcon />} 
                 label={`${duplicatePasswords.length} duplicates`} 
                 sx={{ 
                   color: 'white', 
                   borderColor: 'white',
                   '& .MuiChip-icon': { color: 'white' }
                 }}
                 variant="outlined"
                 size="small" 
               />
               <Chip 
                 icon={<InfoIcon />} 
                 label={`${expiredPasswords.length} expired`} 
                 sx={{ 
                   color: 'white', 
                   borderColor: 'white',
                   '& .MuiChip-icon': { color: 'white' }
                 }}
                 variant="outlined"
                 size="small" 
               />
             </Box>
          </Paper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Search and Filter Bar */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                  }}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showFavorites}
                    onChange={(e) => setShowFavorites(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'white'
                      }
                    }}
                  />
                }
                label="Favorites Only"
                sx={{ color: 'white' }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Box display="flex" gap={1}>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  sx={{ color: viewMode === 'grid' ? 'white' : 'rgba(255,255,255,0.5)' }}
                >
                  <ViewModuleIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  sx={{ color: viewMode === 'list' ? 'white' : 'rgba(255,255,255,0.5)' }}
                >
                  <ViewListIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('compact')}
                  sx={{ color: viewMode === 'compact' ? 'white' : 'rgba(255,255,255,0.5)' }}
                >
                  <ViewCompactIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Password Cards */}
        {viewMode === 'grid' && (
          <Grid container spacing={3}>
            {filteredPasswords.map((password) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={password.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: password.favorite 
                      ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
                      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {password.title}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          {password.username}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        {password.favorite && (
                          <Tooltip title="Favorite">
                            <FavoriteIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />
                          </Tooltip>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, password)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {password.url && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, wordBreak: 'break-all' }}>
                        {password.url}
                      </Typography>
                    )}
                    
                    <Box display="flex" gap={1} sx={{ mb: 2 }}>
                      <Chip 
                        label={password.category} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                      <Chip 
                        label={getStrengthLabel(password.strength || 0)} 
                        size="small" 
                        color={getStrengthColor(password.strength || 0)}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                    
                    {password.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        fontSize: '0.875rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {password.notes}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
                    <Tooltip title="Copy username">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyUsername(password.username)}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy password">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyPassword(password.password)}
                      >
                        <VpnKeyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Toggle favorite">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleFavorite(password.id)}
                      >
                        {password.favorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditPassword(password)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeletePassword(password.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {viewMode === 'list' && (
          <Paper sx={{ p: 2 }}>
            <List>
              {filteredPasswords.map((password) => (
                <ListItem
                  key={password.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 2,
                    background: password.favorite ? 'rgba(255, 193, 7, 0.1)' : 'white'
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {password.title.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6">{password.title}</Typography>
                        {password.favorite && <FavoriteIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />}
                        <Chip 
                          label={getStrengthLabel(password.strength || 0)} 
                          size="small" 
                          color={getStrengthColor(password.strength || 0)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {password.username} • {password.category}
                        </Typography>
                        {password.url && (
                          <Typography variant="body2" color="text.secondary">
                            {password.url}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Box display="flex" gap={1}>
                    <Tooltip title="Copy username">
                      <IconButton size="small" onClick={() => handleCopyUsername(password.username)}>
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy password">
                      <IconButton size="small" onClick={() => handleCopyPassword(password.password)}>
                        <VpnKeyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditPassword(password)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More options">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, password)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {filteredPasswords.length === 0 && !loading && (
          <Box textAlign="center" sx={{ mt: 8 }}>
            <LockIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No passwords found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first password to get started'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPassword}
              size="large"
            >
              Add Your First Password
            </Button>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                    <Box sx={{ mt: 2 }}>
                      <Skeleton variant="rectangular" width="100%" height={20} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Security Panel Sidebar */}
      <Drawer
        anchor="right"
        open={showSecurityPanel}
        onClose={() => setShowSecurityPanel(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            p: 3
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Security Center
          </Typography>
          <IconButton onClick={() => setShowSecurityPanel(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Security Score */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            {securityScore}%
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Overall Security Score
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={securityScore} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white'
              }
            }}
          />
        </Paper>

        {/* Security Issues */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Security Issues
        </Typography>
        
        {weakPasswords.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Weak Passwords</AlertTitle>
            {weakPasswords.length} passwords need strengthening
          </Alert>
        )}
        
        {duplicatePasswords.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Duplicate Passwords</AlertTitle>
            {duplicatePasswords.length} duplicate passwords found
          </Alert>
        )}
        
        {expiredPasswords.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Expired Passwords</AlertTitle>
            {expiredPasswords.length} passwords have expired
          </Alert>
        )}

        {/* Recent Activity */}
        <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
          Recent Activity
        </Typography>
        <List dense>
          {recentActivity.map((activity) => (
            <ListItem key={activity.id} sx={{ px: 0 }}>
              <ListItemIcon>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <TimelineIcon fontSize="small" />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={activity.action}
                secondary={`${activity.timestamp.toLocaleString()} • ${activity.device || activity.item || activity.result}`}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Password Dialog */}
      <Dialog 
        open={showPasswordDialog} 
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {editingPassword ? 'Edit Password' : 'Add New Password'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={passwordForm.title}
                  onChange={(e) => setPasswordForm({...passwordForm, title: e.target.value})}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={passwordForm.username}
                  onChange={(e) => setPasswordForm({...passwordForm, username: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm({...passwordForm, password: e.target.value})}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordGenerator(true)}
                          edge="end"
                        >
                          <VpnKeyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={passwordForm.favorite}
                      onChange={(e) => setPasswordForm({...passwordForm, favorite: e.target.checked})}
                    />
                  }
                  label="Mark as Favorite"
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL"
                  value={passwordForm.url}
                  onChange={(e) => setPasswordForm({...passwordForm, url: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={passwordForm.category}
                  onChange={(e) => setPasswordForm({...passwordForm, category: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={passwordForm.notes}
                  onChange={(e) => setPasswordForm({...passwordForm, notes: e.target.value})}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowPasswordDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSavePassword}
            variant="contained"
            disabled={!passwordForm.title || !passwordForm.password}
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
            }}
          >
            {editingPassword ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Generator Dialog */}
      <PasswordGenerator
        open={showPasswordGenerator}
        onClose={() => setShowPasswordGenerator(false)}
        onGenerate={(password) => {
          setPasswordForm({...passwordForm, password});
          setShowPasswordGenerator(false);
        }}
      />

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedPassword) {
            handleCopyUsername(selectedPassword.username);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          Copy Username
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedPassword) {
            handleCopyPassword(selectedPassword.password);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <VpnKeyIcon fontSize="small" />
          </ListItemIcon>
          Copy Password
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedPassword) {
            handleToggleFavorite(selectedPassword.id);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            {selectedPassword?.favorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </ListItemIcon>
          {selectedPassword?.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          if (selectedPassword) {
            handleEditPassword(selectedPassword);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedPassword) {
            handleDeletePassword(selectedPassword.id);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Dashboard; 