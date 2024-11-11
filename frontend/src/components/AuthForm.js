import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/AuthForm.css';

// Define the function to register user in Firestore
const registerUser = async (user, name) => {
    await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: user.email,
        createdAt: new Date(),
    });
};

const AuthForm = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const location = useLocation();

    // Check if the current route is for registration
    useEffect(() => {
        setIsRegistering(location.pathname === '/register');
    }, [location]);

    const handleAuth = async (e) => {
        e.preventDefault();

        if (isRegistering) {
            // Registration
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
                // Call registerUser to save additional user info to Firestore
                await registerUser(user, name);

                alert('Registration successful!');
            } catch (error) {
                console.error("Registration Error:", error.message);
                alert('Failed to register.');
            }
        } else {
            // Login
            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert('Login successful!');
                window.location.href = '/profile';
            } catch (error) {
                console.error("Login Error:", error.message);
                alert('Failed to login.');
            }
        }
    };

    return (
        <div className="auth-form">
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleAuth}>
                {isRegistering && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
        </div>
    );
};

export default AuthForm;
