document.getElementById('createEventForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  const title = document.getElementById('eventTitle').value;
  const date = document.getElementById('eventDate').value;
  const description = document.getElementById('eventDescription').value;

  if (title && date && description) {
    // Here you can send the event data to the backend for saving
    console.log({ title, date, description });

    // Mock success response
    alert('Event created successfully!');
    window.location.href = 'events.html'; // Redirect to events page
  } else {
    alert('Please fill out all fields.');
  }
});
