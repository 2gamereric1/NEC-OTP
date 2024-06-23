console.log('Scheduler is running...');

const schedule = require('node-schedule');
const { MongoClient } = require('mongodb');
const { exec } = require('child_process');

// MongoDB setup (replace with your connection string and database details)
const uri = 'mongodb+srv://2gamereric1:uvVsKVdZ31K2KYnd@nec-otp.jk8y3u9.mongodb.net/';
const client = new MongoClient(uri);
const database = client.db('NEC_OTP');
const statusLogs = database.collection('status_logs');

// Function to run index.js and log the result
const runAndLog = () => {
  exec('node index.js', async (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    // Parse the output assuming it's JSON with status, severeDelayPercentage, delayPercentage, and totalDelayTime
    const output = JSON.parse(stdout.trim());
    const { status, severeDelayPercentage, delayPercentage, totalDelayTime } = output;

    // Log the status, percentages, and total delay time
    await statusLogs.insertOne({
      timestamp: new Date(),
      status,
      severeDelayPercentage,
      delayPercentage,
      totalDelayTime // Added total delay time here
    });
  });
};

// Schedule the task to run every 5 minutes using node-schedule
schedule.scheduleJob('*/5 * * * *', () => {
  console.log('Task triggered at:', new Date());
  runAndLog();
});