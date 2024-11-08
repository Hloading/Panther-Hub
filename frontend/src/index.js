import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Renders the main App component into the root element
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')  // Ensure that 'root' is the ID of the div in 'index.html'
);
