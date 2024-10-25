const events = [
  { id: 1, title: 'Campus Fair', date: '2024-10-25' },
  { id: 2, title: 'AI Workshop', date: '2024-11-02' },
  { id: 3, title: 'Hackathon', date: '2024-11-15' }
];

// Dynamically load events
function loadEvents() {
  const eventList = document.getElementById('eventList');
  eventList.innerHTML = ''; // Clear the list first

  events.forEach(event => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="event-details.html?id=${event.id}">${event.title} - ${event.date}</a>`;
    eventList.appendChild(li);
  });
}

// Search functionality
document.getElementById('search').addEventListener('input', function(e) {
  const searchQuery = e.target.value.toLowerCase();
  const filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchQuery));
  document.getElementById('eventList').innerHTML = ''; // Clear old list
  filteredEvents.forEach(event => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="event-details.html?id=${event.id}">${event.title} - ${event.date}</a>`;
    document.getElementById('eventList').appendChild(li);
  });
});

window.onload = loadEvents; // Load events on page load
