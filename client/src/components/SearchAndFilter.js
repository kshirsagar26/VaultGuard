import React from 'react';
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  InputAdornment,
  Tooltip,
  Button,
  Collapse,
  Grid,
  Switch,
  FormControlLabel,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Favorite as FavoriteIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';


const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  showFavorites,
  onFavoritesToggle,
  viewMode,
  onViewModeChange,
  onClearFilters,
  sortBy,
  onSortChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,

}) => {
  const { mode } = useTheme();
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'username', label: 'Username' },
    { value: 'category', label: 'Category' },
    { value: 'created', label: 'Date Created' },
    { value: 'updated', label: 'Last Updated' },
    { value: 'strength', label: 'Password Strength' },
  ];



  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || showFavorites;

  return (
         <Paper
       sx={{
         p: 3,
         mb: 3,
         background: 'background.paper',
         border: '1px solid',
         borderColor: 'divider',
         borderRadius: 3,
       }}
     >
      {/* Main Search and Filter Row */}
      <Grid container spacing={3} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search passwords, usernames, or URLs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
                             startAdornment: (
                 <InputAdornment position="start">
                   <SearchIcon sx={{ color: 'text.secondary' }} />
                 </InputAdornment>
               ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                                     <IconButton
                     size="small"
                     onClick={() => onSearchChange('')}
                     sx={{ color: 'text.secondary' }}
                   >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
                         sx={{
               '& .MuiOutlinedInput-root': {
                 borderRadius: 2,
                 '&:hover fieldset': {
                   borderColor: 'primary.main',
                 },
                 '&.Mui-focused fieldset': {
                   borderColor: 'primary.main',
                 },
               },
             }}
          />
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
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



        {/* Sort */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortChange(e.target.value)}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* View Mode Toggle */}
        <Grid item xs={12} md={2}>
          <Box display="flex" gap={1} justifyContent="center">
            <Tooltip title="Grid View">
              <IconButton
                onClick={() => onViewModeChange('grid')}
                sx={{
                  color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                  background: viewMode === 'grid' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="List View">
              <IconButton
                onClick={() => onViewModeChange('list')}
                sx={{
                  color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                  background: viewMode === 'list' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.1)',
                  },
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>

          </Box>
        </Grid>
      </Grid>

      {/* Advanced Filters Row */}
      <Collapse in={showAdvancedFilters}>
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                                  <Switch
                  checked={showFavorites}
                  onChange={(e) => onFavoritesToggle(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: mode === 'light' ? '#f59e0b' : '#fbbf24',
                      '&:hover': {
                        backgroundColor: mode === 'light' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: mode === 'light' ? '#f59e0b' : '#fbbf24',
                    },
                  }}
                />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <FavoriteIcon sx={{ 
                      fontSize: 16, 
                      color: mode === 'light' ? '#f59e0b' : '#fbbf24' 
                    }} />
                    <Typography variant="body2">Favorites Only</Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Box display="flex" gap={1} flexWrap="wrap">
                                {hasActiveFilters && (
                  <Chip
                    label="Clear All Filters"
                    onDelete={onClearFilters}
                    deleteIcon={<ClearIcon />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: mode === 'light' ? '#6366f1' : '#a78bfa',
                      color: mode === 'light' ? '#6366f1' : '#a78bfa',
                      '& .MuiChip-deleteIcon': {
                        color: mode === 'light' ? '#6366f1' : '#a78bfa',
                      },
                    }}
                  />
                )}
                                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    onDelete={() => onSearchChange('')}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: mode === 'light' ? '#3b82f6' : '#60a5fa',
                      color: mode === 'light' ? '#3b82f6' : '#60a5fa',
                    }}
                  />
                )}
                                {selectedCategory !== 'All' && (
                  <Chip
                    label={`Category: ${selectedCategory}`}
                    onDelete={() => onCategoryChange('All')}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: mode === 'light' ? '#10b981' : '#34d399',
                      color: mode === 'light' ? '#10b981' : '#34d399',
                    }}
                  />
                )}
                {showFavorites && (
                  <Chip
                    label="Favorites Only"
                    onDelete={() => onFavoritesToggle(false)}
                    variant="outlined"
                    size="small"
                    icon={<FavoriteIcon />}
                    sx={{
                      borderColor: mode === 'light' ? '#f59e0b' : '#fbbf24',
                      color: mode === 'light' ? '#f59e0b' : '#fbbf24',
                      '& .MuiChip-icon': {
                        color: mode === 'light' ? '#f59e0b' : '#fbbf24',
                      },
                    }}
                  />
                )}

              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* Toggle Advanced Filters */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          startIcon={<FilterIcon />}
          onClick={onToggleAdvancedFilters}
          size="small"
                     sx={{
             color: 'text.secondary',
             textTransform: 'none',
             '&:hover': {
               background: 'rgba(99, 102, 241, 0.1)',
               color: 'primary.main',
             },
           }}
        >
          {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchAndFilter; 