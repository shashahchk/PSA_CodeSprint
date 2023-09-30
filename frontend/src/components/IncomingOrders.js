import {
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import React, { useState, useEffect } from "react";

const IncomingOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetching data from the Flask API
    fetch("http://localhost:5000/api/fetch-data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data.orders);
        console.log(data.orders);
      })
      .catch((error) =>
        console.error("Error fetching incoming orders:", error)
      );
  }, []);

  return (
    <Grid container rowGap={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" sx={{ m: 5 }}>
          Incoming Orders
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shipping Line</TableCell>
              <TableCell>Vessel Capacity</TableCell>
              <TableCell>Weight of Order</TableCell>
              <TableCell>Port of Origin</TableCell>
              <TableCell>Port of Destination</TableCell>
              <TableCell>Arrival Time</TableCell>
              <TableCell>Destination Time</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Cargo Type</TableCell>
              <TableCell>Idle Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => {
              <TableRow key={index}>
                <TableCell>{order["Shipping Line"]}</TableCell>
                <TableCell>{order["Vessel Capacity (TEUs)"]}</TableCell>
                <TableCell>{order["Weight of Order (tons)"]}</TableCell>
                <TableCell>{order["Port of Origin"]}</TableCell>
                <TableCell>{order["Port of Destination"]}</TableCell>
                <TableCell>
                  {new Date(order["Arrival Time"]).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(order["Destination Time"]).toLocaleString()}
                </TableCell>
                <TableCell>{order["Priority"]}</TableCell>
                <TableCell>{order["Cargo Type"]}</TableCell>
                <TableCell>{order["Idle Time (hours)"]}</TableCell>
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default IncomingOrders;
