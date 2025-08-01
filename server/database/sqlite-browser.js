const { initDatabase, getDatabase, closeDatabase } = require('./db.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function runQuery(query) {
  try {
    await initDatabase();
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  } catch (error) {
    throw error;
  }
}

function displayResults(rows) {
  if (!rows || rows.length === 0) {
    console.log('No results found.');
    return;
  }
  
  // Get column names from first row
  const columns = Object.keys(rows[0]);
  
  // Calculate column widths
  const columnWidths = {};
  columns.forEach(col => {
    columnWidths[col] = col.length;
    rows.forEach(row => {
      const value = row[col] ? row[col].toString() : '';
      columnWidths[col] = Math.max(columnWidths[col], value.length);
    });
  });
  
  // Print header
  let header = '|';
  let separator = '|';
  columns.forEach(col => {
    header += ` ${col.padEnd(columnWidths[col])} |`;
    separator += ` ${'-'.repeat(columnWidths[col])} |`;
  });
  console.log(header);
  console.log(separator);
  
  // Print rows
  rows.forEach(row => {
    let line = '|';
    columns.forEach(col => {
      const value = row[col] ? row[col].toString() : '';
      line += ` ${value.padEnd(columnWidths[col])} |`;
    });
    console.log(line);
  });
  
  console.log(`\nTotal rows: ${rows.length}`);
}

async function interactiveMode() {
  console.log('SQLite Browser - Interactive Mode');
  console.log('Type SQL queries or "exit" to quit');
  console.log('Example queries:');
  console.log('  SELECT * FROM users;');
  console.log('  SELECT * FROM passwords WHERE user_id = 1;');
  console.log('  SELECT username, COUNT(*) as password_count FROM users JOIN passwords ON users.id = passwords.user_id GROUP BY users.id;');
  console.log('');
  
  const askQuestion = () => {
    rl.question('SQL> ', async (input) => {
      const query = input.trim();
      
      if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
        console.log('Goodbye!');
        await closeDatabase();
        rl.close();
        process.exit(0);
        return;
      }
      
      if (!query) {
        askQuestion();
        return;
      }
      
      try {
        const results = await runQuery(query);
        displayResults(results);
      } catch (error) {
        console.error('Error executing query:', error.message);
      }
      
      console.log('');
      askQuestion();
    });
  };
  
  askQuestion();
}

// Command line interface
async function main() {
  const query = process.argv[2];
  
  if (!query) {
    await interactiveMode();
    return;
  }
  
  try {
    const results = await runQuery(query);
    displayResults(results);
  } catch (error) {
    console.error('Error executing query:', error.message);
  } finally {
    await closeDatabase();
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  runQuery,
  displayResults
}; 