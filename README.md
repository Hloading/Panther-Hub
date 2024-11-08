
# Panther Hub Project

Panther Hub is a centralized campus event management platform that provides real-time updates, interactive maps, and RSVP functionality for students, faculty, and staff.

## Project Structure

- **backend/**: Contains server-side code with routes, controllers, models, and configurations.
- **frontend/**: Includes React components, pages, and styles.
- **database/**: SQL script for database setup.
- **dist/**: Contains the production build.
- **node_modules/**: Installed npm dependencies.

## How to Run

1. **Backend**:
   - Navigate to `backend/`.
   - Install dependencies: `npm install`.
   - Start the server: `node app.js` or `npm start`.

2. **Frontend**:
   - Navigate to `frontend/`.
   - Install dependencies: `npm install`.
   - Run the development server: `npm start`.

3. **Build for Production**:
   - Run `npm run build` to create a production build in `dist/`.

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=panther_hub
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Frontend (.env)
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Dependencies

- **Frontend**: React, React Router, Google Maps API
- **Backend**: Node.js, Express, MongoDB/Mongoose, Twilio for notifications

## License
This project is open-source and available under the MIT License.
