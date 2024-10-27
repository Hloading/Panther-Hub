// Mock user data
const userProfile = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  events: [
    { title: 'Campus Fair', date: '2024-10-25' },
    { title: 'AI Workshop', date: '2024-11-02' }
  ]
};

// Load user profile data
function loadProfile() {
  document.getElementById('userName').innerText = userProfile.name;
  document.getElementById('userEmail').innerText = userProfile.email;

  const eventList = document.getElementById('registeredEvents');
  userProfile.events.forEach(event => {
    const li = document.createElement('li');
    li.innerText = `${event.title} - ${event.date}`;
    eventList.appendChild(li);
  });
}

window.onload = loadProfile;
