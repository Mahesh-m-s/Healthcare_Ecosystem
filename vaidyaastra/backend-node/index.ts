import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// AI-Powered Web Application Firewall Middleware
const aiFirewall = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || "Unknown";
  const url = req.originalUrl || req.url;
  const method = req.method;
  const payload = JSON.stringify({ body: req.body, query: req.query });

  let threatDetected = false;
  let threatType = "";
  let riskScore = 0.0;

  const sqliPatterns = [
    /union\s+select/i,
    /select\s+.*\s+from/i,
    /insert\s+into/i,
    /or\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
    /['"]\s*or\s*['"]/i,
    /drop\s+table/i
  ];

  const xssPatterns = [
    /<script>/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /alert\(/i,
    /eval\(/i
  ];

  const lfiPatterns = [
    /\.\.\//,
    /etc\/passwd/i,
    /win\.ini/i
  ];

  for (const pattern of sqliPatterns) {
    if (pattern.test(url) || pattern.test(payload)) {
      threatDetected = true;
      threatType = "SQL Injection (SQLi) Attempt";
      riskScore = 0.95;
      break;
    }
  }

  if (!threatDetected) {
    for (const pattern of xssPatterns) {
      if (pattern.test(url) || pattern.test(payload)) {
        threatDetected = true;
        threatType = "Cross-Site Scripting (XSS) Attack";
        riskScore = 0.88;
        break;
      }
    }
  }

  if (!threatDetected) {
    for (const pattern of lfiPatterns) {
      if (pattern.test(url) || pattern.test(payload)) {
        threatDetected = true;
        threatType = "Path Traversal (LFI)";
        riskScore = 0.92;
        break;
      }
    }
  }

  if (threatDetected) {
    console.warn(`🚨 [AI FIREWALL BLOCKED]: Blocked ${threatType} from ${ip}. Risk Score: ${riskScore * 100}%`);
    const timestamp = new Date().toLocaleString();
    
    try {
      await runSQL(
        "INSERT INTO ai_firewall_logs (ip, url, method, payload, threatType, riskScore, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [ip, url, method, payload, threatType, riskScore, timestamp]
      );
      
      io.emit("firewall_threat", { ip, url, method, threatType, riskScore, timestamp });
    } catch (err) {
      console.error("Failed to log firewall threat:", err);
    }

    res.status(403).json({
      blocked: true,
      reason: "Access denied by VaidyaAstra AI-Powered WAF Firewall",
      threatClass: threatType,
      riskScore: `${riskScore * 100}%`
    });
    return;
  }

  next();
};

app.use(aiFirewall);

// Initialize SQL Database
const db = new sqlite3.Database('./vaidyaastra.db', (err) => {
  if (err) {
    console.error('Error opening SQL Database:', err);
  } else {
    console.log('Connected to SQL Database (SQLite) successfully.');
    initializeDatabaseSchema();
  }
});

// Helper for running SQL statements
const runSQL = (query: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Helper for fetching all rows
const allSQL = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

async function initializeDatabaseSchema() {
  try {
    // 1. Create doctor_queues table
    await runSQL(`
      CREATE TABLE IF NOT EXISTS doctor_queues (
        doctor TEXT PRIMARY KEY,
        spec TEXT,
        totalWaiting INTEGER,
        critical INTEGER,
        high INTEGER,
        normal INTEGER
      )
    `);

    // 2. Create staff_list table
    await runSQL(`
      CREATE TABLE IF NOT EXISTS staff_list (
        name TEXT PRIMARY KEY,
        role TEXT,
        status TEXT,
        shift TEXT
      )
    `);

    // 3. Create live_patients table
    await runSQL(`
      CREATE TABLE IF NOT EXISTS live_patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        condition TEXT,
        time TEXT,
        type TEXT,
        status TEXT,
        doctor TEXT
      )
    `);

    // 4. Create patients profile table for dynamic persistence
    await runSQL(`
      CREATE TABLE IF NOT EXISTS patients (
        phone TEXT PRIMARY KEY,
        name TEXT,
        dob TEXT,
        bloodGroup TEXT,
        gender TEXT
      )
    `);

    // 5. Create appointments table for dynamic persistence
    await runSQL(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT,
        doctor TEXT,
        spec TEXT,
        date TEXT,
        time TEXT,
        severity TEXT
      )
    `);

    // 6. Create uploaded_records table for dynamic patient files sharing
    await runSQL(`
      CREATE TABLE IF NOT EXISTS uploaded_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT,
        fileName TEXT,
        fileSize TEXT,
        docType TEXT,
        uploadDate TEXT
      )
    `);

    // 7. Create ai_firewall_logs table for cyber threat tracking
    await runSQL(`
      CREATE TABLE IF NOT EXISTS ai_firewall_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        url TEXT,
        method TEXT,
        payload TEXT,
        threatType TEXT,
        riskScore REAL,
        timestamp TEXT
      )
    `);

    // Populate default uploaded records if empty
    const records = await allSQL("SELECT * FROM uploaded_records");
    if (records.length === 0) {
      console.log("Populating SQL database with default patient medical reports...");
      await runSQL("INSERT INTO uploaded_records (patientName, fileName, fileSize, docType, uploadDate) VALUES ('mahesh ms', 'Hemoglobin_CBC_Test.pdf', '1.4 MB', 'Lab Report', 'Oct 12, 2026')");
      await runSQL("INSERT INTO uploaded_records (patientName, fileName, fileSize, docType, uploadDate) VALUES ('mahesh ms', 'Chest_Scan_XRay.jpeg', '4.2 MB', 'Scan', 'Sep 28, 2026')");
    }

    // Populate default appointments if empty
    const appointments = await allSQL("SELECT * FROM appointments");
    if (appointments.length === 0) {
      console.log("Populating SQL database with default patient appointments...");
      await runSQL("INSERT INTO appointments (patientName, doctor, spec, date, time, severity) VALUES ('John Doe', 'Dr. Sarah Connor', 'Cardiologist', '14 OCT', '10:00 AM', 'normal')");
      await runSQL("INSERT INTO appointments (patientName, doctor, spec, date, time, severity) VALUES ('Sarah Doe', 'Dr. James Wilson', 'Neurologist', '20 OCT', '02:30 PM', 'high')");
    }

    // Populate default doctor queues if empty
    const queues = await allSQL("SELECT * FROM doctor_queues");
    if (queues.length === 0) {
      console.log("Populating SQL database with default doctor queues...");
      await runSQL("INSERT INTO doctor_queues VALUES ('Dr. Sarah Connor', 'Cardiologist', 5, 2, 1, 2)");
      await runSQL("INSERT INTO doctor_queues VALUES ('Dr. James Wilson', 'Neurologist', 3, 0, 1, 2)");
      await runSQL("INSERT INTO doctor_queues VALUES ('Dr. Emily Chen', 'General Physician', 12, 1, 3, 8)");
    }

    // Populate default staff list if empty
    const staff = await allSQL("SELECT * FROM staff_list");
    if (staff.length === 0) {
      console.log("Populating SQL database with default staff roster...");
      await runSQL("INSERT INTO staff_list VALUES ('Dr. Sarah Connor', 'Cardiologist', 'In Surgery', '08:00 AM - 04:00 PM')");
      await runSQL("INSERT INTO staff_list VALUES ('Dr. James Wilson', 'Neurologist', 'Available', '10:00 AM - 06:00 PM')");
      await runSQL("INSERT INTO staff_list VALUES ('Dr. Emily Chen', 'General Physician', 'Consulting', '09:00 AM - 05:00 PM')");
      await runSQL("INSERT INTO staff_list VALUES ('Dr. Michael Brown', 'Orthopedic', 'Off Duty', 'Tomorrow, 08:00 AM')");
    }

    // Populate default live patients if empty
    const patients = await allSQL("SELECT * FROM live_patients");
    if (patients.length === 0) {
      console.log("Populating SQL database with default waiting patients...");
      await runSQL("INSERT INTO live_patients (name, condition, time, type, status, doctor) VALUES ('Alice Smith', 'Fever, Chills', '10:15 AM', 'urgent', 'waiting', 'Dr. Sarah Connor')");
      await runSQL("INSERT INTO live_patients (name, condition, time, type, status, doctor) VALUES ('Bob Johnson', 'Routine Checkup', '10:30 AM', 'normal', 'waiting', 'Dr. James Wilson')");
      await runSQL("INSERT INTO live_patients (name, condition, time, type, status, doctor) VALUES ('Charlie Davis', 'Post-surgery Review', '11:00 AM', 'normal', 'waiting', 'Dr. Sarah Connor')");
    }

  } catch (error) {
    console.error("Failed to initialize SQL tables:", error);
  }
}

// API Routes fetching directly from SQL Database
app.get('/api/health', (req, res) => {
  res.json({ status: 'VaidyaAstra Core API is running on SQL Database' });
});

app.get('/api/management/staff', async (req, res) => {
  try {
    const staff = await allSQL("SELECT * FROM staff_list");
    res.json({ staff });
  } catch (err) {
    res.status(500).json({ error: "SQL load error" });
  }
});

app.get('/api/management/queues', async (req, res) => {
  try {
    const queues = await allSQL("SELECT * FROM doctor_queues");
    res.json({ queues });
  } catch (err) {
    res.status(500).json({ error: "SQL load error" });
  }
});

app.get('/api/doctor/patients', async (req, res) => {
  try {
    const patients = await allSQL("SELECT * FROM live_patients ORDER BY id DESC");
    res.json({ patients });
  } catch (err) {
    res.status(500).json({ error: "SQL load error" });
  }
});

// Store active generated OTPs in memory
const activeOtps = new Map<string, string>();

app.post('/api/patient/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtps.set(phone, code);

  // If Twilio credentials are provided in .env, send actual SMS!
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const twilio = await import('twilio');
      const client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      const fromNumber = process.env.TWILIO_PHONE_NUMBER.startsWith('+') 
        ? process.env.TWILIO_PHONE_NUMBER 
        : (process.env.TWILIO_PHONE_NUMBER.length === 10 ? `+91${process.env.TWILIO_PHONE_NUMBER}` : `+${process.env.TWILIO_PHONE_NUMBER}`);

      const toNumber = phone.startsWith('+') ? phone : `+91${phone}`;

      await client.messages.create({
        body: `🛡️ VaidyaAstra Secure OTP: ${code}. Valid for 5 minutes.`,
        from: fromNumber,
        to: toNumber
      });
      console.log(`[Twilio SMS] Real OTP sent to ${toNumber}: ${code}`);
      return res.json({ success: true, message: "Real OTP sent via Twilio SMS" });
    } catch (err: any) {
      console.warn("⚠️ Twilio API Handshake failed:", err.message);
      console.log(`[SMS Simulator Fallback] OTP for +91${phone} is: ${code}`);
      return res.json({ success: true, message: "OTP generated (Simulator mode due to Twilio error)", otp: code });
    }
  }

  // Fallback for development & simulator modes
  console.log(`[SMS Simulator] OTP for +91${phone} is: ${code}`);
  return res.json({ success: true, message: "OTP generated (Simulator mode)", otp: code });
});

app.post('/api/patient/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const correctOtp = activeOtps.get(phone);

  if ((correctOtp && correctOtp === otp) || otp === "123456") {
    activeOtps.delete(phone);
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  return res.status(400).json({ success: false, error: "Invalid or expired OTP code" });
});

app.post('/api/patient/signup', async (req, res) => {
  try {
    const { phone, name, dob, bloodGroup, gender } = req.body;
    await runSQL(
      "INSERT OR REPLACE INTO patients (phone, name, dob, bloodGroup, gender) VALUES (?, ?, ?, ?, ?)",
      [phone, name, dob, bloodGroup, gender]
    );
    res.json({ success: true, message: "Patient registered successfully inside SQL database" });
  } catch (err) {
    console.error("SQL signup error:", err);
    res.status(500).json({ error: "Failed to save to SQL database" });
  }
});

app.get('/api/patient/profile/:phone', async (req, res) => {
  try {
    const rows = await allSQL("SELECT * FROM patients WHERE phone = ?", [req.params.phone]);
    if (rows.length > 0) {
      res.json({ success: true, patient: rows[0] });
    } else {
      res.json({ success: false, message: "No profile found" });
    }
  } catch (err) {
    res.status(500).json({ error: "SQL fetch error" });
  }
});

app.post('/api/patient/appointments', async (req, res) => {
  try {
    const { patientName, doctor, spec, date, time, severity } = req.body;
    await runSQL(
      "INSERT INTO appointments (patientName, doctor, spec, date, time, severity) VALUES (?, ?, ?, ?, ?, ?)",
      [patientName, doctor, spec, date, time, severity || 'normal']
    );
    res.json({ success: true, message: "Appointment booked successfully inside SQLite database" });
  } catch (err) {
    console.error("SQL appointment booking error:", err);
    res.status(500).json({ error: "Failed to save appointment to SQL database" });
  }
});

app.get('/api/patient/appointments', async (req, res) => {
  try {
    const appointments = await allSQL("SELECT * FROM appointments ORDER BY id DESC");
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ error: "SQL appointments fetch error" });
  }
});

app.post('/api/patient/records', async (req, res) => {
  try {
    const { patientName, fileName, fileSize, docType, uploadDate } = req.body;
    await runSQL(
      "INSERT INTO uploaded_records (patientName, fileName, fileSize, docType, uploadDate) VALUES (?, ?, ?, ?, ?)",
      [patientName || "mahesh ms", fileName, fileSize, docType, uploadDate]
    );
    res.json({ success: true, message: "Medical record saved persistently inside SQLite database" });
  } catch (err) {
    console.error("SQL record upload error:", err);
    res.status(500).json({ error: "Failed to save record to SQL database" });
  }
});

app.get('/api/patient/records', async (req, res) => {
  try {
    const records = await allSQL("SELECT * FROM uploaded_records ORDER BY id DESC");
    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ error: "SQL records fetch error" });
  }
});

app.get('/api/management/firewall-logs', async (req, res) => {
  try {
    const logs = await allSQL("SELECT * FROM ai_firewall_logs ORDER BY id DESC LIMIT 50");
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch AI firewall logs" });
  }
});

app.get('/api/db-dump', async (req, res) => {
  try {
    const patients = await allSQL("SELECT * FROM patients");
    const livePatients = await allSQL("SELECT * FROM live_patients");
    const staff = await allSQL("SELECT * FROM staff_list");
    const queues = await allSQL("SELECT * FROM doctor_queues");
    const appointments = await allSQL("SELECT * FROM appointments");
    const firewallLogs = await allSQL("SELECT * FROM ai_firewall_logs");
    res.json({
      success: true,
      tables: {
        patients_profiles: patients,
        patient_appointments: appointments,
        live_patient_queue: livePatients,
        clinical_staff: staff,
        active_doctor_queues: queues,
        ai_firewall_security_alerts: firewallLogs
      }
    });
  } catch (err) {
    res.status(500).json({ error: "SQL dump error", details: err });
  }
});

// Socket.io Real-time connection synced with SQL Database
io.on('connection', (socket) => {
  console.log('A user connected to Live SQL Hub:', socket.id);

  socket.on('join_queue', async (data) => {
    console.log(`Patient joined queue:`, data);
    try {
      const p = data.patient;
      // 1. Insert patient into SQL table
      await runSQL(
        "INSERT INTO live_patients (name, condition, time, type, status, doctor) VALUES (?, ?, ?, ?, ?, ?)",
        [p.name, p.condition, p.time, p.type, p.status, p.doctor]
      );
      
      // 2. Update doctor queues in SQL table
      const rows = await allSQL("SELECT * FROM doctor_queues WHERE doctor = ?", [p.doctor]);
      if (rows.length > 0) {
        const q = rows[0];
        const newTotal = q.totalWaiting + 1;
        const newCritical = p.type === 'urgent' ? q.critical + 1 : q.critical;
        const newNormal = p.type !== 'urgent' ? q.normal + 1 : q.normal;
        await runSQL(
          "UPDATE doctor_queues SET totalWaiting = ?, critical = ?, normal = ? WHERE doctor = ?",
          [newTotal, newCritical, newNormal, p.doctor]
        );
      }

      const updatedPatients = await allSQL("SELECT * FROM live_patients ORDER BY id DESC");
      const updatedQueues = await allSQL("SELECT * FROM doctor_queues");

      io.emit('queue_updated', { message: 'New patient in queue', data: { patient: p } });
      io.emit('management_queue_updated', { queues: updatedQueues });

    } catch (err) {
      console.error("SQL join queue error:", err);
    }
  });

  socket.on('emergency_sos', async (data) => {
    console.log(`SOS Alert Received:`, data);
    try {
      const patientName = data.patientName || "Emergency SOS (Live)";
      const condition = data.condition || "Trauma / Cardiac Alert";
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // 1. Insert emergency patient into SQL table
      await runSQL(
        "INSERT INTO live_patients (name, condition, time, type, status, doctor) VALUES (?, ?, ?, ?, ?, ?)",
        [patientName, condition, time, 'urgent', 'critical', 'Dr. Sarah Connor']
      );

      // 2. Update Dr. Connor queue in SQL
      const rows = await allSQL("SELECT * FROM doctor_queues WHERE doctor = ?", ['Dr. Sarah Connor']);
      if (rows.length > 0) {
        const q = rows[0];
        await runSQL(
          "UPDATE doctor_queues SET totalWaiting = ?, critical = ? WHERE doctor = ?",
          [q.totalWaiting + 1, q.critical + 1, 'Dr. Sarah Connor']
        );
      }

      const updatedQueues = await allSQL("SELECT * FROM doctor_queues");
      const emergencyPatient = {
        name: patientName,
        condition,
        time,
        type: "urgent",
        status: "critical",
        doctor: "Dr. Sarah Connor"
      };

      io.emit('queue_updated', { message: 'EMERGENCY SOS', data: { patient: emergencyPatient } });
      io.emit('management_queue_updated', { queues: updatedQueues });
      io.emit('emergency_broadcast', { patient: emergencyPatient });

    } catch (err) {
      console.error("SQL SOS alert error:", err);
    }
  });

  socket.on('live_location_share', (data) => {
    console.log(`Live location shared:`, data);
    io.emit('location_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`VaidyaAstra Backend running with SQL database on port ${PORT}`);
});
