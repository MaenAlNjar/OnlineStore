import React, { useState } from 'react';
import axios from 'axios';
import "./index.css"
const Index = () => { // Renamed to 'Index' instead of 'index'
    const [categoryName, setCategoryName] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName) {
            setMessage("Category name is required");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('https://localhost:7226/Category/create', {
                name: categoryName
            });

            if (response.data.success) {
                setMessage("Category created successfully!");
                setCategoryName('');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("Error occurred while creating category.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Create a New Category</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="categoryName">Category Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Category'}
                </button>
            </form>
        </div>
    );
};

export default Index; // Export the renamed component
