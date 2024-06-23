const express = require('express');
const { MongoClient } = require('mongodb');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MongoDB setup
const uri = 'mongodb+srv://2gamereric1:uvVsKVdZ31K2KYnd@nec-otp.jk8y3u9.mongodb.net/';
const client = new MongoClient(uri);
const database = client.db('NEC_OTP');
const statusLogs = database.collection('status_logs');

// Function to start scheduler.js
const startScheduler = () => {
  const schedulerProcess = exec('node scheduler.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting scheduler: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Scheduler stderr: ${stderr}`);
    }
    console.log(`Scheduler stdout: ${stdout}`);
  });

  schedulerProcess.on('close', (code) => {
    console.log(`Scheduler process exited with code ${code}`);
  });
};

// Function to get the ordinal representation of a number
const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Endpoint to get the current status
app.get('/status', async (req, res) => {
  const latestStatus = await statusLogs.find().sort({ timestamp: -1 }).limit(1).toArray();
  res.json(latestStatus[0]);
});

// Helper function to calculate the monthly "ON FIRE" count with buffer
const calculateMonthlyCount = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const logs = await statusLogs.find({
    timestamp: { $gte: startOfMonth }
  }).sort({ timestamp: 1 }).toArray();

  let count = 0;
  let bufferCount = 0;
  let inBufferPeriod = false;

  logs.forEach((log, index) => {
    console.log(`Log ${index + 1}: Status - ${log.status}, Timestamp - ${log.timestamp}`);
    if (log.status === 'ON FIRE') {
      if (!inBufferPeriod) {
        count++;
        inBufferPeriod = true;
      }
      bufferCount = 0;
    } else {
      bufferCount++;
      if (bufferCount >= 10) {
        inBufferPeriod = false;
      }
    }
  });

  console.log(`Final count: ${count}`);
  return count;
};

// Endpoint to get the monthly "ON FIRE" count with buffer
app.get('/monthly-count', async (req, res) => {
  const count = await calculateMonthlyCount();
  const ordinalCount = getOrdinal(count);
  res.json({ count: ordinalCount });
});

// Connect to MongoDB and start the server
client.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    startScheduler(); // Start the scheduler when the server starts
  });
});



