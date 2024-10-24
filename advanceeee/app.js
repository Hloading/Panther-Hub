// Register User
function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert('User already exists!');
        return false;
    }

    // Add new user
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful!');
    window.location.href = "login.html"; // Redirect to login page
    return true;
}

// Login User
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        // Save session info (simplified for now)
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = "events.html";  // Redirect to events feed
    } else {
        alert('Invalid credentials!');
    }
}

// Redirect to event feed if logged in
function redirectHome() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        window.location.href = "events.html"; // Redirect to events feed
    } else {
        window.location.href = "index.html";  // If not logged in, take them to homepage
    }
}

// Create Event
function createEvent(title, description, date) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const newEvent = {
        id: Date.now(),
        title,
        description,
        date,
        creator: currentUser.email,
        comments: []
    };
    
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    alert('Event created successfully!');
    notifyNewEvent(title);  // Notify about new event
    window.location.href = "my-events.html"; // Redirect to My Events page
}

// Delete Event
function deleteEvent(eventId) {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    
    events = events.filter(event => event.id !== eventId);
    localStorage.setItem('events', JSON.stringify(events));
    alert('Event deleted!');
    renderEvents(); // Re-render event list
}

// Comment on Event
function commentOnEvent(eventId, comment) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex !== -1) {
        const newComment = { user: currentUser.email, text: comment };
        events[eventIndex].comments.push(newComment);
        localStorage.setItem('events', JSON.stringify(events));
        alert('Comment added!');
        notifyNewComment(events[eventIndex].title); // Notify about new comment
        renderEvents(); // Re-render event list
    }
}

// Render Events for both Explore and My Events
function renderEvents(isMyEvents = false) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const eventsList = document.getElementById('events-list') || document.getElementById('my-events-list');
    
    eventsList.innerHTML = '';
    events.forEach(event => {
        // If we're on "My Events", only show the user's own events
        if (isMyEvents && event.creator !== currentUser.email) {
            return;
        }

        const eventItem = document.createElement('li');
        eventItem.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p>${event.date}</p>
            ${event.creator === currentUser.email ? `<button onclick="deleteEvent(${event.id})">Delete Event</button>` : ''}
            <h4>Comments:</h4>
            <ul>${event.comments.map(c => `<li>${c.user}: ${c.text}</li>`).join('')}</ul>
            <input type="text" placeholder="Add a comment..." id="comment-${event.id}">
            <button onclick="commentOnEvent(${event.id}, document.getElementById('comment-${event.id}').value)">Comment</button>
        `;
        eventsList.appendChild(eventItem);
    });
}

// Notify when a new event is created
function notifyNewEvent(title) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    notifications.push({
        type: 'event',
        message: `A new event "${title}" has been created!`,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Notify when a new comment is posted on an event
function notifyNewComment(eventTitle) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    notifications.push({
        type: 'comment',
        message: `A new comment was posted on the event "${eventTitle}".`,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Render Notifications
function renderNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const notificationList = document.getElementById('notification-list');
    
    notificationList.innerHTML = '';
    notifications.forEach(notification => {
        const notificationItem = document.createElement('li');
        notificationItem.innerText = `${notification.message} - ${new Date(notification.timestamp).toLocaleString()}`;
        notificationList.appendChild(notificationItem);
    });
}

// Search Events by Title, Date, or Time
function searchEvents(query, date, time) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const results = events.filter(event => 
        (query && event.title.toLowerCase().includes(query.toLowerCase())) ||
        (date && event.date.includes(date)) ||
        (time && event.date.includes(time))
    );
    
    renderSearchResults(results);
}

// Render Search Results
function renderSearchResults(results) {
    const searchResultsList = document.getElementById('search-results-list') || document.getElementById('events-list');
    searchResultsList.innerHTML = '';

    results.forEach(event => {
        const eventItem = document.createElement('li');
        eventItem.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p>${event.date}</p>
        `;
        searchResultsList.appendChild(eventItem);
    });
}

// Initialize Events on Page Load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('events-list') || document.getElementById('my-events-list')) {
        renderEvents(); // Load events on events or my-events page
    }
    
    if (document.getElementById('notification-list')) {
        renderNotifications(); // Load notifications on profile page
    }
});

