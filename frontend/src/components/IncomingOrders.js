import React, { useState, useEffect } from 'react';

const IncomingOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetching data from the Flask API
        fetch('http://localhost:5000/api/fetch-data')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data.orders)
                console.log(data.orders)
            })
            .catch((error) => console.error('Error fetching incoming orders:', error));
    }, []);

    return (
        <div>
            <h1>Incoming Orders</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Shipping Line</th>
                        <th>Vessel Capacity</th>
                        <th>Weight of Order</th>
                        <th>Port of Origin</th>
                        <th>Port of Destination</th>
                        <th>Arrival Time</th>
                        <th>Destination Time</th>
                        <th>Priority</th>
                        <th>Cargo Type</th>
                        <th>Idle Time</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>{order["Shipping Line"]}</td>
                            <td>{order["Vessel Capacity (TEUs)"]}</td>
                            <td>{order["Weight of Order (tons)"]}</td>
                            <td>{order["Port of Origin"]}</td>
                            <td>{order["Port of Destination"]}</td>
                            <td>{new Date(order["Arrival Time"]).toLocaleString()}</td>
                            <td>{new Date(order["Destination Time"]).toLocaleString()}</td>
                            <td>{order["Priority"]}</td>
                            <td>{order["Cargo Type"]}</td>
                            <td>{order["Idle Time (hours)"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default IncomingOrders;
