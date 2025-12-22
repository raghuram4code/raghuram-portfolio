import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Assuming you named the main component file App.tsx
import './index.css'; // This is where you import your Tailwind base styles

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);