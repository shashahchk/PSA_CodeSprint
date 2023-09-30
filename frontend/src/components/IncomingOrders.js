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
      <Grid item xs={12} sx={{ px: 8 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Port of Origin</TableCell>
              <TableCell>Port of Destination</TableCell>
              <TableCell>Expected Arrival Time</TableCell>
              <TableCell>Weight of Order (tons)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order["Port of Origin"]}</TableCell>
                <TableCell>{order["Port of Destination"]}</TableCell>
                <TableCell>
                  {new Date(order["Expected Time of Arrival"]).toLocaleString()}
                </TableCell>
                <TableCell>{order["Weight of Order (tons)"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default IncomingOrders;
