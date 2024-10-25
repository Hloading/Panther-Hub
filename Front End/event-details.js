// Fetch event ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// Mock event data for demo purposes
const events = [
  { id: 1, title: 'Campus Fair', date: '2024-10-25', description: 'Annual campus fair with food, activities, and games.' },
  { id: 2, title: 'AI Workshop', date: '2024-11-02', description: 'Learn about artificial intelligence and its applications.' },
  { id: 3, title: 'Hackathon', date: '2024-11-15', description: 'Join the campus-wide hackathon and compete with teams.' }
];

// Find the event by ID and display its details
const event = events.find(event => event.id == eventId);

if (event) {
  document.getElementById('eventTitle').innerText = event.title;
  document.getElementById('eventDescription').innerText = event.description;
  document.getElementById('eventDate').innerText = event.date;
} else {
  alert('Event not found');
}

// RSVP button functionality
document.getElementById('rsvpBtn').addEventListener('click', function() {
  const userEmail = prompt('Enter your email to RSVP:'); // For demo purposes

  if (!userEmail) {
    return alert('Email is required to RSVP!');
  }

  // Make a POST request to the backend to save the RSVP
  fetch('http://localhost:3000/rsvp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userEmail: userEmail,
      eventId: event.id
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'RSVP successful!') {
      alert('You have successfully RSVP\'d to the event!');
    } else {
      alert(data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  });
});
