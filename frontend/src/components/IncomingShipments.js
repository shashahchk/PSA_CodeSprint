import { Typography, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import api from "../api/api";
import CustomTable from "./CustomTable";

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

  return (
    <Grid container rowGap={2} sx={{ p: 2 }}>
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
      <Grid item xs={12} sx={{ px: 8 }}>
        <CustomTable
          data={shipments}
          columns={[
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
          ]}
          columnFunctions={{
            "Destination Time": (time) => new Date(time).toLocaleString(),
            "Arrival Time": (time) => new Date(time).toLocaleString(),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default IncomingShipments;
