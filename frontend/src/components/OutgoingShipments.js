import {
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  TableContainer,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import ProgressBar from "./ProgressBar/ProgressBar";
import Loading from "./Loading/Loading";
import { StyledTableCell, StyledTableRow } from "./IncomingShipments";
import { ShipmentsContext } from "../App";

const OutgoingShipments = () => {
  const [shipments, setShipments] = useContext(ShipmentsContext);

  useEffect(() => {
    // Fetching data from the Flask API
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (shipments.length > 0) return;
      const response = (await api.get("/ships")).data.outgoing;
      response.orders = [];
      setShipments({ ...shipments, outgoing: response.map(shipment => ({ ...shipment, orders: [] }))});
    } catch (error) {
      console.error("Error fetching outgoing shipments:", error);
    }
  };

  const columns = [
    "Shipping Line",
    "Vessel Capacity (tonnes)",
    "Port of Origin",
    "Port of Destination",
    "Departure Time",
    "Arrival Time",
    "Priority",
    "Cargo Type",
    "Idle Time (hours)",
    "Weight of Order (tons)",
    "% Capacity",
  ];
  const columnAlignments = {
    "% Capacity": "center",
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
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell key={index} align={columnAlignments[column]}>
                    {column}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.outgoing.map((shipment, index) => (
                <StyledTableRow key={index}>
                  <TableCell>{shipment["Shipping Line"]}</TableCell>
                  <TableCell>{shipment["Vessel Capacity (tonnes)"]}</TableCell>
                  <TableCell>{shipment["Port of Origin"]}</TableCell>
                  <TableCell>{shipment["Port of Destination"]}</TableCell>
                  <TableCell>
                    {new Date(shipment["Departure Time"]).toLocaleString()}
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
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default OutgoingShipments;
