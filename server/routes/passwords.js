const express = require('express');
const { getDatabase } = require('../database/db');
const { deriveKey, encrypt, decrypt } = require('../utils/crypto');

const router = express.Router();

/**
 * Get all passwords for a user
 * GET /api/passwords
 */
router.get('/', async (req, res) => {
  try {
    const { userId, masterPassword, salt } = req.query;
    
    if (!userId || !masterPassword || !salt) {
      return res.status(400).json({ 
        error: 'User ID, master password, and salt are required' 
      });
    }
    
    const db = getDatabase();
    
    // Get all passwords for the user
    db.all(
      'SELECT id, title, username, encrypted_password, encrypted_notes, url, category, created_at, updated_at FROM passwords WHERE user_id = ? ORDER BY updated_at DESC',
      [userId],
      async (err, passwords) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        try {
          // Derive encryption key
          const key = await deriveKey(masterPassword, salt);
          
          // Decrypt password data
          const decryptedPasswords = passwords.map(pwd => {
            try {
              return {
                id: pwd.id,
                title: pwd.title,
                username: pwd.username,
                password: decrypt(pwd.encrypted_password, key),
                notes: pwd.encrypted_notes ? decrypt(pwd.encrypted_notes, key) : '',
                url: pwd.url,
                category: pwd.category,
                createdAt: pwd.created_at,
                updatedAt: pwd.updated_at
              };
            } catch (error) {
              console.error('Decryption error for password ID:', pwd.id, error);
              return null;
            }
          }).filter(Boolean); // Remove failed decryptions
          
          res.json(decryptedPasswords);
        } catch (error) {
          console.error('Decryption error:', error);
          res.status(500).json({ error: 'Failed to decrypt passwords' });
        }
      }
    );
  } catch (error) {
    console.error('Get passwords error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a new password entry
 * POST /api/passwords
 */
router.post('/', async (req, res) => {
  try {
    const { userId, masterPassword, salt, title, username, password, notes, url, category } = req.body;
    
    if (!userId || !masterPassword || !salt || !title || !password) {
      return res.status(400).json({ 
        error: 'User ID, master password, salt, title, and password are required' 
      });
    }
    
    const db = getDatabase();
    
    try {
      // Derive encryption key
      const key = await deriveKey(masterPassword, salt);
      
      // Encrypt sensitive data
      const encryptedPassword = encrypt(password, key);
      const encryptedNotes = notes ? encrypt(notes, key) : null;
      
      // Insert new password entry
      db.run(
        `INSERT INTO passwords (user_id, title, username, encrypted_password, encrypted_notes, url, category) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, title, username || '', encryptedPassword, encryptedNotes, url || '', category || 'General'],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save password' });
          }
          
          res.status(201).json({
            message: 'Password saved successfully',
            id: this.lastID
          });
        }
      );
    } catch (error) {
      console.error('Encryption error:', error);
      res.status(500).json({ error: 'Failed to encrypt password' });
    }
  } catch (error) {
    console.error('Create password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update a password entry
 * PUT /api/passwords/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, masterPassword, salt, title, username, password, notes, url, category } = req.body;
    
    if (!userId || !masterPassword || !salt || !title || !password) {
      return res.status(400).json({ 
        error: 'User ID, master password, salt, title, and password are required' 
      });
    }
    
    const db = getDatabase();
    
    // First verify the password belongs to the user
    db.get(
      'SELECT id FROM passwords WHERE id = ? AND user_id = ?',
      [id, userId],
      async (err, passwordEntry) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!passwordEntry) {
          return res.status(404).json({ error: 'Password not found' });
        }
        
        try {
          // Derive encryption key
          const key = await deriveKey(masterPassword, salt);
          
          // Encrypt sensitive data
          const encryptedPassword = encrypt(password, key);
          const encryptedNotes = notes ? encrypt(notes, key) : null;
          
          // Update password entry
          db.run(
            `UPDATE passwords 
             SET title = ?, username = ?, encrypted_password = ?, encrypted_notes = ?, url = ?, category = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND user_id = ?`,
            [title, username || '', encryptedPassword, encryptedNotes, url || '', category || 'General', id, userId],
            function(err) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to update password' });
              }
              
              if (this.changes === 0) {
                return res.status(404).json({ error: 'Password not found' });
              }
              
              res.json({ message: 'Password updated successfully' });
            }
          );
        } catch (error) {
          console.error('Encryption error:', error);
          res.status(500).json({ error: 'Failed to encrypt password' });
        }
      }
    );
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete a password entry
 * DELETE /api/passwords/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const db = getDatabase();
    
    db.run(
      'DELETE FROM passwords WHERE id = ? AND user_id = ?',
      [id, userId],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Password not found' });
        }
        
        res.json({ message: 'Password deleted successfully' });
      }
    );
  } catch (error) {
    console.error('Delete password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get password categories for a user
 * GET /api/passwords/categories
 */
router.get('/categories', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const db = getDatabase();
    
    db.all(
      'SELECT DISTINCT category FROM passwords WHERE user_id = ? ORDER BY category',
      [userId],
      (err, categories) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        const categoryList = categories.map(cat => cat.category);
        res.json(categoryList);
      }
    );
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 