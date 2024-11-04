// src/App.js
import React, { useState } from 'react';
import Login from './components/login/Login.js';
import EventList from './components/event/EventList';

function App() {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null); // Ajoutez un état pour le rôle de l'utilisateur

    return (
        <div className="App">
            {!userId ? (
                <Login setUserId={setUserId} setUserRole={setUserRole} /> // Passez `setUserRole` à Login
            ) : (
                <EventList userId={userId} userRole={userRole} /> // Passez `userRole` à EventList
            )}
        </div>
    );
}

export default App;
