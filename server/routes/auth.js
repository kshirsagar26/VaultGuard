const express = require('express');
const { getDatabase } = require('../database/db');
const { 
  generateSalt, 
  hashMasterPassword, 
  verifyMasterPassword 
} = require('../utils/crypto');

const router = express.Router();

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { username, masterPasswordHash, salt }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, masterPasswordHash, salt } = req.body;
    
    if (!username || !masterPasswordHash || !salt) {
      return res.status(400).json({ 
        error: 'Username, master password hash, and salt are required' 
      });
    }
    
    const db = getDatabase();
    
    // Check if username already exists
    db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      
      try {
        // Store the client-provided hash and salt
        db.run(
          'INSERT INTO users (username, master_password_hash, salt) VALUES (?, ?, ?)',
          [username, masterPasswordHash, salt],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to create user' });
            }
            
            res.status(201).json({ 
              message: 'User registered successfully',
              userId: this.lastID 
            });
          }
        );
      } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Login user
 * POST /api/auth/login
 * Body: { username, masterPasswordHash }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, masterPasswordHash } = req.body;
    
    if (!username || !masterPasswordHash) {
      return res.status(400).json({ 
        error: 'Username and master password hash are required' 
      });
    }
    
    const db = getDatabase();
    
    // Get user data
    db.get(
      'SELECT id, username, master_password_hash, salt FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        try {
          // Compare the provided hash with stored hash
          if (masterPasswordHash !== user.master_password_hash) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
          
          res.json({
            message: 'Login successful',
            user: {
              id: user.id,
              username: user.username
            },
            // Send salt back to client for encryption/decryption
            salt: user.salt
          });
        } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ error: 'Login failed' });
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Verify master password (for changing master password)
 * POST /api/auth/verify
 * Body: { username, masterPasswordHash }
 */
router.post('/verify', async (req, res) => {
  try {
    const { username, masterPasswordHash } = req.body;
    
    if (!username || !masterPasswordHash) {
      return res.status(400).json({ 
        error: 'Username and master password hash are required' 
      });
    }
    
    const db = getDatabase();
    
    db.get(
      'SELECT master_password_hash FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        try {
          if (masterPasswordHash !== user.master_password_hash) {
            return res.status(401).json({ error: 'Invalid master password' });
          }
          
          res.json({ message: 'Master password verified successfully' });
        } catch (error) {
          console.error('Verification error:', error);
          res.status(500).json({ error: 'Verification failed' });
        }
      }
    );
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get user's salt for client-side password hashing
 * GET /api/auth/salt/:username
 */
router.get('/salt/:username', (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const db = getDatabase();
    
    db.get(
      'SELECT salt FROM users WHERE username = ?',
      [username],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ salt: user.salt });
      }
    );
  } catch (error) {
    console.error('Salt retrieval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 