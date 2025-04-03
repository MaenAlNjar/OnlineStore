import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./index.css"
const CategoriesWithProducts = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch categories with products
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://localhost:7226/Category/all');
                if (response.data.success) {
                    setCategories(response.data.data);
                } else {
                    setError(response.data.message || "Failed to load categories.");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h2>Categories</h2>
            {categories.map(category => (
                <div key={category.id} className="category">
                    <h3>{category.name}</h3>
                    <div className="products">
                        {category.products.map(product => (
                            <div key={product.id} className="product-card">
                                <img src={product.imageUrl} alt={product.name} />
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoriesWithProducts;
