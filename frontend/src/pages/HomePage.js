import React, { useState, useEffect } from 'react';
import { getItems } from '../services/api';

const HomePage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getItems();
            setItems(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Items</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
