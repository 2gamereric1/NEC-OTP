const { fetchAllTrains } = require('amtrak');

// Function to calculate the total delay time for all trains
const getTotalDelayTime = async (northeastTrains) => {
  // Initialize total delay time
  let totalDelayTime = 0;

// Calculate total delay time (assuming delay time is in minutes)
northeastTrains.forEach(train => {
  if (train.trainTimely.toLowerCase().includes('late')) {
    // Extract the delay time from the trainTimely string
    const delayTimeMatch = train.trainTimely.match(/(\d+)\s*hours?|(\d+)\s*minutes?/i);
    let delayTime = 0;
    
    if (delayTimeMatch) {
      const hours = delayTimeMatch[1] ? parseInt(delayTimeMatch[1], 10) : 0;
      const minutes = delayTimeMatch[2] ? parseInt(delayTimeMatch[2], 10) : 0;
      delayTime = (hours * 60) + minutes; // Convert hours to minutes and add to total
    }
    
    totalDelayTime += delayTime;
  }
});

  return totalDelayTime;
};

// Function to check the status of the Northeast Corridor
const checkNortheastCorridorStatus = async () => {
  const trains = await fetchAllTrains();
  const northeastTrains = Object.values(trains).flat().filter(train =>
    train.routeName === 'Northeast Regional' || train.routeName === 'Acela'
  );

  const delayedTrains = northeastTrains.filter(train =>
    train.trainTimely.toLowerCase().includes('late')
  );
  const severelyDelayedTrains = delayedTrains.filter(train =>
    train.trainTimely.toLowerCase().includes('hours')
  );

  const delayPercentage = (delayedTrains.length / northeastTrains.length) * 100;
  const severeDelayPercentage = (severelyDelayedTrains.length / northeastTrains.length) * 100;
  const totalDelayTime = await getTotalDelayTime(northeastTrains);

  const status = severeDelayPercentage > 15 && delayPercentage > 50 ? 'ON FIRE' : 'NOT ON FIRE';

  return {
    status,
    severeDelayPercentage: severeDelayPercentage.toFixed(2),
    delayPercentage: delayPercentage.toFixed(2),
    totalDelayTime // Include the total delay time in the output
  };
};

//Total Delay Time is in minutes.

// Main execution
const main = async () => {
  const { status, severeDelayPercentage, delayPercentage, totalDelayTime } = await checkNortheastCorridorStatus();
  console.log(JSON.stringify({ status, severeDelayPercentage, delayPercentage, totalDelayTime }));
};

main();