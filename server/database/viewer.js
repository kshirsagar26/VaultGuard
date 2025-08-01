const { initDatabase, getDatabase, closeDatabase } = require('./db.js');

async function viewUsers() {
  try {
    await initDatabase();
    const db = getDatabase();
    
    console.log('\n=== USERS TABLE ===');
    console.log('ID | Username | Master Password Hash | Salt | Created At');
    console.log('---|----------|---------------------|------|------------');
    
    db.each('SELECT * FROM users ORDER BY id', (err, row) => {
      if (err) {
        console.error('Error querying users:', err);
        return;
      }
      
      // Truncate the hash and salt for display
      const hashPreview = row.master_password_hash.substring(0, 20) + '...';
      const saltPreview = row.salt.substring(0, 10) + '...';
      
      console.log(`${row.id.toString().padEnd(2)} | ${row.username.padEnd(8)} | ${hashPreview.padEnd(19)} | ${saltPreview.padEnd(4)} | ${row.created_at}`);
    }, (err, count) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`\nTotal users: ${count}`);
      }
    });
    
  } catch (error) {
    console.error('Error viewing users:', error);
  }
}

async function viewPasswords() {
  try {
    await initDatabase();
    const db = getDatabase();
    
    console.log('\n=== PASSWORDS TABLE ===');
    console.log('ID | User ID | Title | Username | Encrypted Password | Category | Created At');
    console.log('---|---------|-------|----------|-------------------|----------|------------');
    
    db.each('SELECT * FROM passwords ORDER BY id', (err, row) => {
      if (err) {
        console.error('Error querying passwords:', err);
        return;
      }
      
      // Truncate the encrypted password for display
      const encryptedPreview = row.encrypted_password.substring(0, 20) + '...';
      
      console.log(`${row.id.toString().padEnd(2)} | ${row.user_id.toString().padEnd(7)} | ${row.title.padEnd(5)} | ${(row.username || '').padEnd(8)} | ${encryptedPreview.padEnd(17)} | ${row.category.padEnd(8)} | ${row.created_at}`);
    }, (err, count) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`\nTotal passwords: ${count}`);
      }
    });
    
  } catch (error) {
    console.error('Error viewing passwords:', error);
  }
}

async function viewDatabaseStats() {
  try {
    await initDatabase();
    const db = getDatabase();
    
    console.log('\n=== DATABASE STATISTICS ===');
    
    // Count users
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        console.error('Error counting users:', err);
      } else {
        console.log(`Total Users: ${row.count}`);
      }
    });
    
    // Count passwords
    db.get('SELECT COUNT(*) as count FROM passwords', (err, row) => {
      if (err) {
        console.error('Error counting passwords:', err);
      } else {
        console.log(`Total Passwords: ${row.count}`);
      }
    });
    
    // Passwords per user
    db.get('SELECT user_id, COUNT(*) as count FROM passwords GROUP BY user_id ORDER BY count DESC LIMIT 1', (err, row) => {
      if (err) {
        console.error('Error getting password stats:', err);
      } else if (row) {
        console.log(`Most passwords by user ID ${row.user_id}: ${row.count}`);
      }
    });
    
    // Categories
    db.all('SELECT category, COUNT(*) as count FROM passwords GROUP BY category ORDER BY count DESC', (err, rows) => {
      if (err) {
        console.error('Error getting category stats:', err);
      } else {
        console.log('\nPasswords by Category:');
        rows.forEach(row => {
          console.log(`  ${row.category}: ${row.count}`);
        });
      }
    });
    
  } catch (error) {
    console.error('Error viewing database stats:', error);
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'users':
      await viewUsers();
      break;
    case 'passwords':
      await viewPasswords();
      break;
    case 'stats':
      await viewDatabaseStats();
      break;
    case 'all':
      await viewUsers();
      await viewPasswords();
      await viewDatabaseStats();
      break;
    default:
      console.log('Database Viewer Usage:');
      console.log('  node viewer.js users     - View all users');
      console.log('  node viewer.js passwords - View all passwords');
      console.log('  node viewer.js stats     - View database statistics');
      console.log('  node viewer.js all       - View everything');
      break;
  }
  
  // Close database connection
  setTimeout(async () => {
    await closeDatabase();
    process.exit(0);
  }, 1000);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  viewUsers,
  viewPasswords,
  viewDatabaseStats
}; 