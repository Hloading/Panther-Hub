import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import AuthForm from './components/AuthForm';
import './styles/global.css';

function App() {
    return (
        <Router>
            <header>
                <h1>Panther Hub</h1>
                <p>Your gateway to campus events</p>
            </header>

            <main className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/login" element={<AuthForm />} />
                    <Route path="/register" element={<AuthForm />} />
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
            </main>

            <footer>
                <p>&copy; 2023 Panther Hub. All rights reserved.</p>
            </footer>
        </Router>
    );
}

export default App;
