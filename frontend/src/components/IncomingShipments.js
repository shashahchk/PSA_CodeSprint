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
import api from "../api/api";
import ProgressBar from "./ProgressBar/ProgressBar";

const IncomingShipments = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    // Fetching data from the Flask API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/fetch-data");
      setShipments(response.data.ships);
    } catch (error) {
      console.error("Error fetching incoming shipments:", error);
    }
  };

  const columns = [
    "Shipping Line",
    "Vessel Capacity (tonnes)",
    "Port of Origin",
    "Port of Destination",
    "Destination Time",
    "Arrival Time",
    "Priority",
    "Cargo Type",
    "Idle Time (hours)",
    "Weight of Order (tons)",
    "% Loaded",
  ];
  const columnAlignments = {
    "% Loaded": "center",
  };

  return (
    <Grid container sx={{ p: 2 }}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ m: 3 }}
          textAlign="left"
          fontWeight="500"
        >
          Incoming Shipments
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={columnAlignments[column]}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment, index) => (
              <TableRow key={index}>
                <TableCell>{shipment["Shipping Line"]}</TableCell>
                <TableCell>{shipment["Vessel Capacity (tonnes)"]}</TableCell>
                <TableCell>{shipment["Port of Origin"]}</TableCell>
                <TableCell>{shipment["Port of Destination"]}</TableCell>
                <TableCell>
                  {new Date(shipment["Destination Time"]).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(shipment["Arrival Time"]).toLocaleString()}
                </TableCell>
                <TableCell>{shipment["Priority"]}</TableCell>
                <TableCell>{shipment["Cargo Type"]}</TableCell>
                <TableCell>{shipment["Idle Time (hours)"]}</TableCell>
                <TableCell>{shipment["Weight of Order (tons)"]}</TableCell>
                <TableCell>
                  <ProgressBar width="50%" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default IncomingShipments;
