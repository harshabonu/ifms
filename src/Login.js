// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://ifms-backend.onrender.com/api/v1/user/login', { email, password });

            // Save the token in localStorage
            localStorage.setItem('token', response.data.token);

            // Redirect to dashboard or some protected route
            navigate('/home');
        } catch (error) {
            setError(error.response.data.message || 'Login failed');
        }
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.loginBox}>
                <h2 style={styles.loginTitle}>Login</h2>
                {error && <p style={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleLogin} style={styles.loginForm}>
                    <div style={styles.formGroup}>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.inputField}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.inputField}
                        />
                    </div>
                    <button type="submit" style={styles.loginButton}>Login</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    loginContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    loginBox: {
        backgroundColor: '#ffffff',
        padding: '40px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        width: '400px',
    },
    loginTitle: {
        textAlign: 'center',
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    loginForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '20px',
    },
    inputField: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    loginButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#5cb85c',
        border: 'none',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    loginButtonHover: {
        backgroundColor: '#4cae4c',
    },
    errorMessage: {
        color: 'red',
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '20px',
    },
};

export default Login;
