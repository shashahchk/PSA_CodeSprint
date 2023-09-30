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
import Loading from "./Loading";

const OutgoingShipments = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    // Fetching data from the Flask API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = (await api.get("/ships")).data.outgoing;
      setShipments(
        response.map((ship) => ({
          ...ship,
          "Weight of Order (tons)": ship["Weight of Order (tons)"] * 100,
        }))
      );
    } catch (error) {
      console.error("Error fetching outgoing shipments:", error);
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

  if (shipments.length === 0) return <Loading />;

  return (
    <Grid container rowGap={2} sx={{ px: 8, py: 4 }}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ m: 3 }}
          textAlign="left"
          fontWeight="500"
        >
          Outgoing Shipments
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
                  <ProgressBar
                    width={`${
                      (shipment["Weight of Order (tons)"] /
                        shipment["Vessel Capacity (tonnes)"]) *
                      100
                    }%`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default OutgoingShipments;
