import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Skeleton,
  Fab,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
} from '@mui/material';
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

import axios from 'axios';
import Sidebar from './Sidebar';
import PasswordCard from './PasswordCard';
import DashboardStats from './DashboardStats';
import SearchAndFilter from './SearchAndFilter';
import PasswordGenerator from './PasswordGenerator';
import PasswordDialog from './PasswordDialog';
import PasswordListView from './PasswordListView';
import ThemeToggle from './ThemeToggle';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const Dashboard = () => {
  const { theme: muiTheme } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const { user, salt, masterPassword, deriveKey, encrypt, decrypt, logout, checkPasswordStrength, login } = useAuth();
  
  // State management
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsMasterPassword, setNeedsMasterPassword] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('updated');

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showPasswords, setShowPasswords] = useState({});

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
    strength: 0,
    strengthText: 'Very Weak',
    strengthFeedback: []
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (user && salt && !masterPassword) {
      setNeedsMasterPassword(true);
      setError('Please re-enter your master password to continue.');
      return;
    }
    
    if (user && salt && masterPassword) {
      loadPasswords();
      loadCategories();
      loadRecentActivity();
    }
  }, [user, salt, masterPassword]);



  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

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



  const loadRecentActivity = () => {
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
      strength: 0,
      strengthText: 'Very Weak',
      strengthFeedback: []
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
      strength: password.strength || 0,
      strengthText: password.strengthText || 'Very Weak',
      strengthFeedback: password.strengthFeedback || []
    });
    setShowPasswordDialog(true);
  };

  const handleSavePassword = async () => {
    console.log('handleSavePassword called with:', { passwordForm, user, editingPassword });
    
    // Validate required data
    if (!user || !user.id) {
      console.error('User not found or missing user.id');
      setError('User authentication error');
      return;
    }
    
    if (!passwordForm.title || !passwordForm.password) {
      console.error('Missing required fields:', { title: passwordForm.title, password: passwordForm.password });
      setError('Please fill in all required fields');
      return;
    }
    
    if (!masterPassword || !salt) {
      console.error('Authentication data missing:', { masterPassword: !!masterPassword, salt: !!salt });
      setError('Authentication error. Please log in again.');
      return;
    }
    
    console.log('Form validation passed, proceeding with save...');
    console.log('Debug values:', { 
      masterPassword: masterPassword ? 'present' : 'missing', 
      salt: salt ? 'present' : 'missing',
      passwordForm: passwordForm 
    });
    
    try {
      const key = await deriveKey(masterPassword, salt);
      console.log('Key derived successfully:', key ? 'present' : 'missing');
      
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
      // Reset form data
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
        strength: 0,
        strengthText: 'Very Weak',
        strengthFeedback: []
      });
      setEditingPassword(null);
      loadPasswords();
      loadCategories();
         } catch (error) {
       console.error('Error saving password:', error);
       console.error('Error details:', {
         message: error.message,
         response: error.response?.data,
         status: error.response?.status,
         config: error.config
       });
       
       if (error.response?.status === 500) {
         setError('Server error. Please check if the server is running and restart it if needed.');
       } else if (error.response?.status === 404) {
         setError('API endpoint not found. Please check server configuration.');
       } else if (error.code === 'ERR_NETWORK') {
         setError('Network error. Please check if the server is running on the correct port.');
       } else {
         setError(`Failed to save password: ${error.response?.data?.error || error.message}`);
       }
     }
  };

  const handleDeletePassword = async (passwordId) => {
    try {
      await axios.delete(`/api/passwords/${passwordId}`, {
        params: { userId: user.id }
      });
      loadPasswords();
      loadCategories();
    } catch (error) {
      console.error('Error deleting password:', error);
      setError('Failed to delete password');
    }
  };

  const handleToggleFavorite = async (passwordId) => {
    const updatedPasswords = passwords.map(pwd => 
      pwd.id === passwordId ? { ...pwd, favorite: !pwd.favorite } : pwd
    );
    setPasswords(updatedPasswords);
  };

  const handleTogglePasswordVisibility = (passwordId) => {
    setShowPasswords(prev => ({
      ...prev,
      [passwordId]: !prev[passwordId]
    }));
  };

  const handleVisitUrl = (url) => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setShowFavorites(false);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'logout') {
      logout();
    }
  };

  const handleReEnterMasterPassword = () => {
    if (masterPasswordInput.trim()) {
      // Update the master password in the auth context
      login(user, salt, masterPasswordInput);
      setNeedsMasterPassword(false);
      setMasterPasswordInput('');
      setError('');
    }
  };

  // Filter and sort passwords
  const filteredAndSortedPasswords = passwords
    .filter(password => {
      const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           password.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || password.category === selectedCategory;
      const matchesFavorites = !showFavorites || password.favorite;
      
      
      
             return matchesSearch && matchesCategory && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'username':
          return (a.username || '').localeCompare(b.username || '');
        case 'category':
          return a.category.localeCompare(b.category);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'strength':
          return b.strength - a.strength;
        default:
          return 0;
      }
    });

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Box>
                         <DashboardStats
               passwords={passwords}
               recentActivity={recentActivity}
             />
            
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h4" fontWeight={600} sx={{ color: '#1e293b' }}>
                Recent Passwords
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadPasswords}
                sx={{ borderRadius: 2 }}
              >
                Refresh
              </Button>
            </Box>

            <Grid container spacing={3}>
              {filteredAndSortedPasswords.slice(0, 6).map((password) => (
                <Grid item xs={12} sm={6} md={4} key={password.id}>
                  <PasswordCard
                    password={password}
                    onEdit={handleEditPassword}
                    onDelete={handleDeletePassword}
                    onToggleFavorite={handleToggleFavorite}
                    onVisitUrl={handleVisitUrl}
                    showPassword={showPasswords[password.id] || false}
                    onTogglePasswordVisibility={() => handleTogglePasswordVisibility(password.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'passwords':
        return (
          <Box>
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              showFavorites={showFavorites}
              onFavoritesToggle={setShowFavorites}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onClearFilters={handleClearFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showAdvancedFilters={showAdvancedFilters}
              onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item}>
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            ) : filteredAndSortedPasswords.length === 0 ? (
              <Box textAlign="center" sx={{ mt: 8 }}>
                <SecurityIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
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
                  sx={{ borderRadius: 2 }}
                >
                  Add Your First Password
                </Button>
              </Box>
            ) : (
              <>
                {viewMode === 'grid' && (
                  <Grid container spacing={3}>
                    {filteredAndSortedPasswords.map((password) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={password.id}>
                        <PasswordCard
                          password={password}
                          onEdit={handleEditPassword}
                          onDelete={handleDeletePassword}
                          onToggleFavorite={handleToggleFavorite}
                          onVisitUrl={handleVisitUrl}
                          showPassword={showPasswords[password.id] || false}
                          onTogglePasswordVisibility={() => handleTogglePasswordVisibility(password.id)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
                
                {viewMode === 'list' && (
                  <PasswordListView
                    passwords={filteredAndSortedPasswords}
                    onEdit={handleEditPassword}
                    onDelete={handleDeletePassword}
                    onToggleFavorite={handleToggleFavorite}
                    onVisitUrl={handleVisitUrl}
                    showPasswords={showPasswords}
                    onTogglePasswordVisibility={handleTogglePasswordVisibility}
                  />
                )}
                
                
              </>
            )}
          </Box>
        );

      case 'settings':
        return (
          <Box textAlign="center" sx={{ mt: 8 }}>
            <Typography variant="h4" color="text.secondary">
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Settings panel will be available soon.
            </Typography>
          </Box>
        );
      case 'profile':
        return (
          <Box textAlign="center" sx={{ mt: 8 }}>
            <Typography variant="h4" color="text.secondary">
              Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Profile management will be available soon.
            </Typography>
          </Box>
        );
      default:
        return (
          <Box textAlign="center" sx={{ mt: 8 }}>
            <Typography variant="h4" color="text.secondary">
              Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              The requested page is not available.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
             <Sidebar
         open={sidebarOpen}
         onClose={() => setSidebarOpen(false)}
         user={user}
         passwords={passwords}
         onNavigate={handleNavigate}
         currentView={currentView}
       />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
                 <AppBar
           position="static"
           elevation={0}
           sx={{
             background: 'background.paper',
             borderBottom: '1px solid',
             borderColor: 'divider',
             color: 'text.primary',
           }}
         >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {currentView === 'dashboard' ? 'Dashboard' : 
               currentView === 'passwords' ? 'Password Manager' :
               currentView === 'settings' ? 'Settings' :
               currentView === 'profile' ? 'Profile' :
               'VaultGuard'}
            </Typography>

                         <Box display="flex" gap={1}>
               <ThemeToggle />
               <IconButton>
                 <NotificationsIcon />
               </IconButton>
               <Button
                 variant="contained"
                 startIcon={<AddIcon />}
                 onClick={handleAddPassword}
                 sx={{ borderRadius: 2 }}
               >
                 Add Password
               </Button>
             </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {renderContent()}
        </Box>
      </Box>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add password"
          onClick={handleAddPassword}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
                         background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialogs */}
      <PasswordDialog
        open={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          // Reset form data when dialog is closed
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
            strength: 0,
            strengthText: 'Very Weak',
            strengthFeedback: []
          });
          setEditingPassword(null);
        }}
        password={editingPassword}
        formData={passwordForm}
        onFormChange={setPasswordForm}
        onSave={handleSavePassword}
        onGeneratePassword={() => setShowPasswordGenerator(true)}
      />

             <PasswordGenerator
         open={showPasswordGenerator}
         onClose={() => setShowPasswordGenerator(false)}
         onGenerate={(password) => {
           // Calculate strength for generated password
           const strengthResult = checkPasswordStrength(password);
           setPasswordForm({ 
             ...passwordForm, 
             password,
             strength: strengthResult.score,
             strengthText: strengthResult.strength,
             strengthFeedback: strengthResult.feedback
           });
           setShowPasswordGenerator(false);
         }}
       />

       {/* Master Password Re-entry Dialog */}
       <Dialog open={needsMasterPassword} onClose={() => {}} maxWidth="sm" fullWidth>
         <DialogTitle>Re-enter Master Password</DialogTitle>
         <DialogContent>
           <TextField
             fullWidth
             type="password"
             label="Master Password"
             value={masterPasswordInput}
             onChange={(e) => setMasterPasswordInput(e.target.value)}
             onKeyPress={(e) => {
               if (e.key === 'Enter') {
                 handleReEnterMasterPassword();
               }
             }}
             sx={{ mt: 2 }}
           />
         </DialogContent>
         <DialogActions>
           <Button onClick={handleReEnterMasterPassword} variant="contained">
             Continue
           </Button>
         </DialogActions>
       </Dialog>
    </Box>
  );
};

export default Dashboard; 