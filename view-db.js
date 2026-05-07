let sqlite3;

try {
  sqlite3 = require('sqlite3').verbose();
} catch (e) {
  try {
    sqlite3 = require('./vaidyaastra/backend-node/node_modules/sqlite3').verbose();
  } catch (err) {
    console.error("❌ sqlite3 module not found. Please run: cd vaidyaastra/backend-node; npm install");
    process.exit(1);
  }
}

const fs = require('fs');
const dbPath = fs.existsSync('./vaidyaastra/backend-node/vaidyaastra.db') 
  ? './vaidyaastra/backend-node/vaidyaastra.db' 
  : './vaidyaastra.db';
const db = new sqlite3.Database(dbPath);

console.log("\n==============================================");
console.log("   🏥 VAIDYAASTRA SQLITE DATABASE EXPLORER");
console.log("==============================================\n");

db.all("SELECT * FROM patients", (err, rows) => {
  if (err) {
    console.error("❌ Error reading patients table:", err.message);
  } else {
    console.log("👤 REGISTERED PATIENTS PROFILES:");
    if (rows.length === 0) {
      console.log("   (No profiles registered yet. Signup on the website first!)\n");
    } else {
      console.table(rows);
    }
  }

  db.all("SELECT * FROM live_patients", (err, rows) => {
    if (err) {
      console.error("❌ Error reading live patients queue:", err.message);
    } else {
      console.log("\n🚨 LIVE PATIENT CONSULTATION QUEUE:");
      if (rows.length === 0) {
        console.log("   (Queue is currently empty)\n");
      } else {
        console.table(rows);
      }
    }
    
    db.all("SELECT * FROM appointments", (err, rows) => {
      if (err) {
        console.error("❌ Error reading appointments table:", err.message);
      } else {
        console.log("\n📅 PATIENT CLINIC APPOINTMENTS:");
        if (rows.length === 0) {
          console.log("   (No active appointments booked)\n");
        } else {
          console.table(rows);
        }
      }
      
      db.all("SELECT * FROM ai_firewall_logs", (err, rows) => {
        if (err) {
          console.error("❌ Error reading AI firewall logs table:", err.message);
        } else {
          console.log("\n🛡️ AI FIREWALL CYBER SECURITY LOGS:");
          if (rows.length === 0) {
            console.log("   (No cyber security threats detected yet - System Secure!)\n");
          } else {
            console.table(rows);
          }
        }
        
        db.close();
      });
    });
  });
});
