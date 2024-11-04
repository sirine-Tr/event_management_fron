
import React, { useState } from 'react';
import axios from 'axios';
import './login.css'
const Login = ({ setUserId, setUserRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        try {
            
            const response = await axios.post('http://127.0.0.1:8000/login/', { username, password });

            
            if (response.data && response.data.id && response.data.role) {
                setUserId(response.data.id);          
                setUserRole(response.data.role);      
            } else {
                setError("Login failed. Please check your username and password.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError("Login failed. Please check your username and password.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
