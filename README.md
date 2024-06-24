# NEC-OTP
An unofficial live status and major incident tracker for Amtrak's Northeast Corridor.

# Dependencies

NodeJS https://nodejs.org/en/download/prebuilt-installer/current
Amtrak V3 API https://www.npmjs.com/package/amtrak/v/3.0.4
Axios https://www.npmjs.com/package/axios
Nodemon https://www.npmjs.com/package/nodemon
Express https://www.npmjs.com/package/express
Node Scheduler https://www.npmjs.com/package/node-schedule

# MongoDB

Information about the number of major delays in a month, the total time delayed at a given interval, and the % of trains both majorly and minorly delayed are stored in a MongoDB instance.  The files are tiny, so the free tier should suffice. You need to replace the sample url (mongodb+srv) with the login credential for your account for the program to function as intended.

# Methodology

To measure whether the Northeast Corridor is "on fire," I came up with a simple, yet very effective system for measuring delays.  Trains are divided into one of three categories: on-time, minor delays (1 min - 1hr) and major delays (1hr +).  For the corridor to be marked as on fire, a sufficient number of trains along the corridor must be both major and minorly delayed.  A figure I came up with is 15% of trains are majorly delayed (on most weekdays, thats ~4 trains), and 50% of trains have some sort of minor delay.  This caught the signal issues at Penn Station before Amtrak tweeted about it (6/23/24), so I am hopeful it will continue to be accurate.  As for the monthly tracker, it only keeps track of 1 "on-fire" call at once.  To avoid counter inflation as delays are residing (or, in other words, as service fluctuates while things are returning to normal), there is a buffer of 10 "not on fire" outputs in a row before another incident can be declared.  If the server runs at its scheduled 5 minute intervals, that's just under an hour of *normal* service before another incident can be called.

This project wouldn't have been possible without Piero's amazing Amtrak API https://github.com/piemadd/amtrak :)
