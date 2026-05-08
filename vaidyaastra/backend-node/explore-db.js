const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'vaidyaastra.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite database:", err.message);
    process.exit(1);
  }
});

console.log("\n⚡ \x1b[36mConnecting to VaidyaAstra Database...\x1b[0m\n");

// Function to query and print a table
function printTable(tableName) {
  return new Promise((resolve) => {
    db.all(`SELECT * FROM ${tableName} LIMIT 10`, [], (err, rows) => {
      if (err) {
        console.log(`⚠️  Table \x1b[33m${tableName}\x1b[0m is empty or not created yet.`);
        resolve();
        return;
      }

      console.log(`\n📊 \x1b[35m=== TABLE: ${tableName.toUpperCase()} ===\x1b[0m`);
      if (rows.length === 0) {
        console.log(" (Empty Table)");
      } else {
        console.table(rows);
      }
      resolve();
    });
  });
}

async function run() {
  await printTable('patients');
  await printTable('doctor_queues');
  await printTable('live_patients');
  
  console.log("\n👋 \x1b[32mDatabase scan complete!\x1b[0m\n");
  db.close();
}

run();
