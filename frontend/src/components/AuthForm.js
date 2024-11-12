// src/components/AuthForm.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import '../styles/AuthForm.css';

const registerUserInFirestore = async (user, name) => {
  // Save user info in Firestore, using the Firebase UID as the document ID
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

  // Only needed during registration
  const [name, setName] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsRegistering(location.pathname === '/register');
  }, [location]);

  // Map Firebase error codes to user-friendly messages
  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email is already in use. Please use a different email.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please check and try again.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous error
    setSuccessMessage(''); // Clear any previous success message

    try {
      if (isRegistering) {
        // Registration process
        if (!name.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }

        // Client-side validation for password length
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await registerUserInFirestore(user, name); // Save user info to Firestore
        setSuccessMessage('Registration successful!');
        navigate('/profile'); // Redirect to profile after registration
      } else {
        // Login process
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Login successful!');
        navigate('/profile'); // Redirect to profile after login
      }
    } catch (error) {
      console.error(
        isRegistering ? 'Registration Error:' : 'Login Error:',
        error
      );
      const errorMessage = getErrorMessage(error);
      setError(errorMessage); // Set error message for UI display
    } finally {
      setLoading(false); // Stop loading indicator
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      {/* Display success or error messages */}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AuthForm;
