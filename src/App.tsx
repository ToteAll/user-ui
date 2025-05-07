import React, { useState, useEffect } from 'react';
import './App.css';
import OrderForm from './container/order';
import axios from 'axios';

function App() {
    // State to store user data, loading and error status
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Use effect to fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8080/user-api/user/1', {
                    responseType: 'text', // Ensure response is treated as plain text
                });
                setUserName(response.data); // Store user name
            } catch (err) {
                setError('Failed to load user'); // Set error message
            } finally {
                setIsLoading(false); // Set loading to false after the request is complete
            }
        };

        fetchUser(); // Call the function to fetch user data
    }, []); // Empty dependency array to run the effect once when the component mounts

    return (
        <div className="container mt-5">
            <div className="row align-items-center mb-4">
                <div className="col-md-6">
                    <h1 className="text-primary">ToteAll Delivery</h1>
                </div>
                <div className="col-md-6 text-end">
                    {/* Render the loading, error, or userName */}
                    {isLoading ? (
                        <span>Loading...</span>
                    ) : error ? (
                        <span className="text-danger">{error}</span>
                    ) : (
                        userName && <span className="fw-bold">Welcome, {userName}!</span>
                    )}
                </div>
            </div>

            <OrderForm />
        </div>
    );
}

export default App;
