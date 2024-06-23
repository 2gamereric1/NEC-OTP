// Fetch the current status
fetch('/status')
  .then(response => response.json())
  .then(data => {
    const statusElement = document.getElementById('status-message');
    const statusImageElement = document.getElementById('status-image');
    if (data.status === 'ON FIRE') {
      statusElement.textContent = onFireMessage;
      statusImageElement.src = onFireImage;
    } else {
      statusElement.textContent = notOnFireMessage;
      statusImageElement.src = notOnFireImage;
    }
  });

// Fetch the monthly "ON FIRE" count
fetch('/monthly-count')
  .then(response => response.json())
  .then(data => {
    document.getElementById('monthly-count').textContent = `This is the ${data.count} major delay of the month`;
  });
