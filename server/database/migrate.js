const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'passwords.db');

function migrateDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      
      console.log('Connected to SQLite database for migration');
      
      // Check if columns exist and add them if they don't
      db.all("PRAGMA table_info(passwords)", (err, columns) => {
        if (err) {
          console.error('Error checking table schema:', err);
          reject(err);
          return;
        }
        
        const columnNames = columns.map(col => col.name);
        console.log('Existing columns:', columnNames);
        
        const migrations = [];
        
        // Add missing columns
        if (!columnNames.includes('tags')) {
          migrations.push("ALTER TABLE passwords ADD COLUMN tags TEXT");
        }
        if (!columnNames.includes('favorite')) {
          migrations.push("ALTER TABLE passwords ADD COLUMN favorite BOOLEAN DEFAULT 0");
        }
        if (!columnNames.includes('expiry_date')) {
          migrations.push("ALTER TABLE passwords ADD COLUMN expiry_date DATETIME");
        }
        if (!columnNames.includes('strength')) {
          migrations.push("ALTER TABLE passwords ADD COLUMN strength INTEGER DEFAULT 0");
        }
        
        if (migrations.length === 0) {
          console.log('No migrations needed - all columns already exist');
          db.close();
          resolve();
          return;
        }
        
        console.log('Running migrations:', migrations);
        
        // Run migrations
        let completed = 0;
        migrations.forEach((migration, index) => {
          db.run(migration, (err) => {
            if (err) {
              console.error(`Migration ${index + 1} failed:`, err);
              reject(err);
              return;
            }
            
            console.log(`Migration ${index + 1} completed:`, migration);
            completed++;
            
            if (completed === migrations.length) {
              console.log('All migrations completed successfully');
              db.close();
              resolve();
            }
          });
        });
      });
    });
  });
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { migrateDatabase }; 